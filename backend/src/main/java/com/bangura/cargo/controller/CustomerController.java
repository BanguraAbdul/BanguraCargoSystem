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
    
    @RequestMapping(value = "/shipments", method = RequestMethod.POST)
    public ResponseEntity<?> createShipment(Authentication authentication, 
                                            @RequestBody Map<String, Object> request) {
        try {
            String email = authentication.getName();
            User user = userService.getUserByEmail(email);
            
            Shipment shipment = new Shipment();
            
            // Handle both old and new field formats
            String origin = request.containsKey("origin") ? 
                (String) request.get("origin") : 
                request.get("originCountry") + ", " + request.get("originAddress");
            String destination = request.containsKey("destination") ? 
                (String) request.get("destination") : 
                request.get("destinationCountry") + ", " + request.get("destinationAddress");
            
            shipment.setOrigin(origin);
            shipment.setDestination(destination);
            shipment.setDescription((String) request.get("description"));
            shipment.setWeight(Double.valueOf(request.get("weight").toString()));
            
            Long productTypeId = Long.valueOf(request.get("productTypeId").toString());
            
            Shipment createdShipment = shipmentService.createShipment(shipment, user.getId(), productTypeId);
            return ResponseEntity.ok(createdShipment);
        } catch (Exception e) {
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
            
            // Update shipment fields
            String origin = request.containsKey("origin") ? 
                (String) request.get("origin") : 
                request.get("originCountry") + ", " + request.get("originAddress");
            String destination = request.containsKey("destination") ? 
                (String) request.get("destination") : 
                request.get("destinationCountry") + ", " + request.get("destinationAddress");
            
            shipment.setOrigin(origin);
            shipment.setDestination(destination);
            shipment.setDescription((String) request.get("description"));
            shipment.setWeight(Double.valueOf(request.get("weight").toString()));
            
            Long productTypeId = Long.valueOf(request.get("productTypeId").toString());
            ProductType productType = productTypeService.getProductTypeById(productTypeId);
            shipment.setProductType(productType);
            
            Shipment updatedShipment = shipmentService.updateShipment(shipment);
            return ResponseEntity.ok(updatedShipment);
        } catch (Exception e) {
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
