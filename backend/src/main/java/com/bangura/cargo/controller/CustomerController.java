package com.bangura.cargo.controller;

import com.bangura.cargo.model.Payment;
import com.bangura.cargo.model.ProductType;
import com.bangura.cargo.model.Shipment;
import com.bangura.cargo.model.User;
import com.bangura.cargo.service.PaymentService;
import com.bangura.cargo.service.ProductTypeService;
import com.bangura.cargo.service.ShipmentService;
import com.bangura.cargo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/customer")
@CrossOrigin(origins = "http://localhost:4200")
public class CustomerController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private ShipmentService shipmentService;
    
    @Autowired
    private PaymentService paymentService;
    
    @Autowired
    private ProductTypeService productTypeService;
    
    @RequestMapping(value = "/profile", method = RequestMethod.GET)
    public ResponseEntity<?> getProfile(Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userService.getUserByEmail(email);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @RequestMapping(value = "/profile", method = RequestMethod.PUT)
    public ResponseEntity<?> updateProfile(Authentication authentication, @RequestBody User user) {
        try {
            String email = authentication.getName();
            User currentUser = userService.getUserByEmail(email);
            User updatedUser = userService.updateUser(currentUser.getId(), user);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @RequestMapping(value = "/product-types", method = RequestMethod.GET)
    public ResponseEntity<List<ProductType>> getProductTypes() {
        return ResponseEntity.ok(productTypeService.getAllProductTypes());
    }
    
    @RequestMapping(value = "/shipments/test", method = RequestMethod.POST)
    public ResponseEntity<?> testEndpoint(@RequestBody(required = false) String body) {
        System.out.println("🔵 TEST ENDPOINT REACHED!");
        System.out.println("📦 Body: " + body);
        return ResponseEntity.ok("Test successful! Body received: " + body);
    }
    
    @RequestMapping(value = "/shipments", method = RequestMethod.POST)
    public ResponseEntity<?> createShipment(Authentication authentication, 
                                            @RequestBody(required = false) Map<String, Object> request) {
        System.out.println("🔵 CustomerController - Create shipment request received");
        System.out.println("📦 Authentication: " + (authentication != null ? authentication.getName() : "NULL"));
        System.out.println("📦 Request data: " + request);
        
        if (authentication == null) {
            System.out.println("❌ Authentication is NULL!");
            return ResponseEntity.status(401).body("Not authenticated");
        }
        
        if (request == null || request.isEmpty()) {
            System.out.println("❌ Request body is NULL or empty!");
            return ResponseEntity.badRequest().body("Request body is required");
        }
        
        try {
            String email = authentication.getName();
            System.out.println("👤 User email: " + email);
            User user = userService.getUserByEmail(email);
            System.out.println("✅ User found: " + user.getEmail() + ", Role: " + user.getRole());
            
            Shipment shipment = new Shipment();
            
            // Sender Information
            shipment.setSenderName((String) request.get("senderName"));
            shipment.setSenderPhone((String) request.get("senderPhone"));
            shipment.setSenderEmail((String) request.get("senderEmail"));
            
            // Origin Information
            shipment.setOriginCountry((String) request.get("originCountry"));
            shipment.setOriginCity((String) request.get("originCity"));
            shipment.setOriginAddress((String) request.get("originAddress"));
            shipment.setOriginPostalCode((String) request.get("originPostalCode"));
            
            // For backward compatibility - combine into origin field
            String origin = request.get("originAddress") + ", " + 
                           request.get("originCity") + ", " + 
                           request.get("originCountry");
            shipment.setOrigin(origin);
            
            // Recipient Information
            shipment.setRecipientName((String) request.get("recipientName"));
            shipment.setRecipientPhone((String) request.get("recipientPhone"));
            shipment.setRecipientEmail((String) request.get("recipientEmail"));
            
            // Destination Information
            shipment.setDestinationCountry((String) request.get("destinationCountry"));
            shipment.setDestinationCity((String) request.get("destinationCity"));
            shipment.setDestinationAddress((String) request.get("destinationAddress"));
            shipment.setDestinationPostalCode((String) request.get("destinationPostalCode"));
            
            // For backward compatibility - combine into destination field
            String destination = request.get("destinationAddress") + ", " + 
                                request.get("destinationCity") + ", " + 
                                request.get("destinationCountry");
            shipment.setDestination(destination);
            
            // Package Details
            shipment.setDescription((String) request.get("description"));
            shipment.setWeight(Double.valueOf(request.get("weight").toString()));
            shipment.setQuantity(request.get("quantity") != null ? 
                Integer.valueOf(request.get("quantity").toString()) : 1);
            
            // Dimensions
            if (request.get("length") != null && !request.get("length").toString().isEmpty()) {
                shipment.setLength(Double.valueOf(request.get("length").toString()));
            }
            if (request.get("width") != null && !request.get("width").toString().isEmpty()) {
                shipment.setWidth(Double.valueOf(request.get("width").toString()));
            }
            if (request.get("height") != null && !request.get("height").toString().isEmpty()) {
                shipment.setHeight(Double.valueOf(request.get("height").toString()));
            }
            
            // Additional Information
            if (request.get("declaredValue") != null && !request.get("declaredValue").toString().isEmpty()) {
                shipment.setDeclaredValue(Double.valueOf(request.get("declaredValue").toString()));
            }
            shipment.setInsurance(request.get("insurance") != null ? 
                (Boolean) request.get("insurance") : false);
            shipment.setFragile(request.get("fragile") != null ? 
                (Boolean) request.get("fragile") : false);
            shipment.setSpecialInstructions((String) request.get("specialInstructions"));
            
            Long productTypeId = Long.valueOf(request.get("productTypeId").toString());
            System.out.println("🏷️  Product Type ID: " + productTypeId);
            
            Shipment createdShipment = shipmentService.createShipment(shipment, user.getId(), productTypeId);
            System.out.println("✅ Shipment created successfully: " + createdShipment.getId());
            return ResponseEntity.ok(createdShipment);
        } catch (Exception e) {
            System.out.println("❌ Error creating shipment: " + e.getClass().getName());
            System.out.println("❌ Error message: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @RequestMapping(value = "/shipments", method = RequestMethod.GET)
    public ResponseEntity<?> getMyShipments(Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userService.getUserByEmail(email);
            List<Shipment> shipments = shipmentService.getShipmentsByUserId(user.getId());
            return ResponseEntity.ok(shipments);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @RequestMapping(value = "/shipments/{id}", method = RequestMethod.GET)
    public ResponseEntity<?> getShipmentById(Authentication authentication, @PathVariable Long id) {
        try {
            String email = authentication.getName();
            User user = userService.getUserByEmail(email);
            Shipment shipment = shipmentService.getShipmentById(id);
            
            // Ensure customer can only view their own shipments
            if (!shipment.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(403).body("You can only view your own shipments");
            }
            
            return ResponseEntity.ok(shipment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @RequestMapping(value = "/shipments/{id}", method = RequestMethod.PUT)
    public ResponseEntity<?> updateShipment(Authentication authentication, 
                                            @PathVariable Long id,
                                            @RequestBody Map<String, Object> request) {
        try {
            String email = authentication.getName();
            User user = userService.getUserByEmail(email);
            Shipment shipment = shipmentService.getShipmentById(id);
            
            // Ensure customer can only edit their own shipments
            if (!shipment.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(403).body("You can only edit your own shipments");
            }
            
            // Only allow editing if status is REQUESTED
            if (shipment.getStatus() != Shipment.ShipmentStatus.REQUESTED) {
                return ResponseEntity.badRequest().body("Can only edit shipments in REQUESTED status");
            }
            
            // Sender Information
            shipment.setSenderName((String) request.get("senderName"));
            shipment.setSenderPhone((String) request.get("senderPhone"));
            shipment.setSenderEmail((String) request.get("senderEmail"));
            
            // Origin Information
            shipment.setOriginCountry((String) request.get("originCountry"));
            shipment.setOriginCity((String) request.get("originCity"));
            shipment.setOriginAddress((String) request.get("originAddress"));
            shipment.setOriginPostalCode((String) request.get("originPostalCode"));
            
            // For backward compatibility
            String origin = request.get("originAddress") + ", " + 
                           request.get("originCity") + ", " + 
                           request.get("originCountry");
            shipment.setOrigin(origin);
            
            // Recipient Information
            shipment.setRecipientName((String) request.get("recipientName"));
            shipment.setRecipientPhone((String) request.get("recipientPhone"));
            shipment.setRecipientEmail((String) request.get("recipientEmail"));
            
            // Destination Information
            shipment.setDestinationCountry((String) request.get("destinationCountry"));
            shipment.setDestinationCity((String) request.get("destinationCity"));
            shipment.setDestinationAddress((String) request.get("destinationAddress"));
            shipment.setDestinationPostalCode((String) request.get("destinationPostalCode"));
            
            // For backward compatibility
            String destination = request.get("destinationAddress") + ", " + 
                                request.get("destinationCity") + ", " + 
                                request.get("destinationCountry");
            shipment.setDestination(destination);
            
            // Package Details
            shipment.setDescription((String) request.get("description"));
            shipment.setWeight(Double.valueOf(request.get("weight").toString()));
            shipment.setQuantity(request.get("quantity") != null ? 
                Integer.valueOf(request.get("quantity").toString()) : 1);
            
            // Dimensions
            if (request.get("length") != null && !request.get("length").toString().isEmpty()) {
                shipment.setLength(Double.valueOf(request.get("length").toString()));
            }
            if (request.get("width") != null && !request.get("width").toString().isEmpty()) {
                shipment.setWidth(Double.valueOf(request.get("width").toString()));
            }
            if (request.get("height") != null && !request.get("height").toString().isEmpty()) {
                shipment.setHeight(Double.valueOf(request.get("height").toString()));
            }
            
            // Additional Information
            if (request.get("declaredValue") != null && !request.get("declaredValue").toString().isEmpty()) {
                shipment.setDeclaredValue(Double.valueOf(request.get("declaredValue").toString()));
            }
            shipment.setInsurance(request.get("insurance") != null ? 
                (Boolean) request.get("insurance") : false);
            shipment.setFragile(request.get("fragile") != null ? 
                (Boolean) request.get("fragile") : false);
            shipment.setSpecialInstructions((String) request.get("specialInstructions"));
            
            Long productTypeId = Long.valueOf(request.get("productTypeId").toString());
            ProductType productType = productTypeService.getProductTypeById(productTypeId);
            shipment.setProductType(productType);
            
            Shipment updatedShipment = shipmentService.updateShipment(shipment);
            return ResponseEntity.ok(updatedShipment);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @RequestMapping(value = "/shipments/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<?> deleteShipment(Authentication authentication, @PathVariable Long id) {
        try {
            String email = authentication.getName();
            User user = userService.getUserByEmail(email);
            Shipment shipment = shipmentService.getShipmentById(id);
            
            // Ensure customer can only delete their own shipments
            if (!shipment.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(403).body("You can only delete your own shipments");
            }
            
            // Only allow deleting if status is REQUESTED
            if (shipment.getStatus() != Shipment.ShipmentStatus.REQUESTED) {
                return ResponseEntity.badRequest().body("Can only delete shipments in REQUESTED status");
            }
            
            shipmentService.deleteShipment(id);
            return ResponseEntity.ok("Shipment deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @RequestMapping(value = "/shipments/track/{trackingNumber}", method = RequestMethod.GET)
    public ResponseEntity<?> trackShipment(@PathVariable String trackingNumber) {
        try {
            Shipment shipment = shipmentService.getShipmentByTrackingNumber(trackingNumber);
            return ResponseEntity.ok(shipment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @RequestMapping(value = "/payments", method = RequestMethod.POST)
    public ResponseEntity<?> createPayment(Authentication authentication, 
                                           @RequestBody Map<String, Object> request) {
        try {
            String email = authentication.getName();
            User user = userService.getUserByEmail(email);
            
            Payment payment = new Payment();
            payment.setAmount(Double.valueOf(request.get("amount").toString()));
            payment.setMethod((String) request.get("method"));
            
            Long shipmentId = request.get("shipmentId") != null ? 
                    Long.valueOf(request.get("shipmentId").toString()) : null;
            
            Payment createdPayment = paymentService.createPayment(payment, user.getId(), shipmentId);
            return ResponseEntity.ok(createdPayment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @RequestMapping(value = "/payments", method = RequestMethod.GET)
    public ResponseEntity<?> getMyPayments(Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userService.getUserByEmail(email);
            List<Payment> payments = paymentService.getPaymentsByUserId(user.getId());
            return ResponseEntity.ok(payments);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
