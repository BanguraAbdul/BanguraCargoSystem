package com.bangura.cargo.controller;

import com.bangura.cargo.model.Payment;
import com.bangura.cargo.model.Shipment;
import com.bangura.cargo.model.User;
import com.bangura.cargo.service.PaymentService;
import com.bangura.cargo.service.ShipmentService;
import com.bangura.cargo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.List;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:4200")
public class AdminController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private ShipmentService shipmentService;
    
    @Autowired
    private PaymentService paymentService;
    
    @RequestMapping(value = "/users", method = RequestMethod.GET)
    public ResponseEntity<?> getAllUsers() {
        try {
            List<User> users = userService.getAllUsers();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @RequestMapping(value = "/users/pending-customers", method = RequestMethod.GET)
    public ResponseEntity<?> getPendingCustomers() {
        try {
            List<User> users = userService.getPendingCustomers();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @RequestMapping(value = "/users/{userId}/approve", method = RequestMethod.POST)
    public ResponseEntity<?> approveCustomer(@PathVariable Long userId) {
        try {
            User user = userService.approveUser(userId);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @RequestMapping(value = "/users/{userId}", method = RequestMethod.PUT)
    public ResponseEntity<?> updateUser(@PathVariable Long userId, @RequestBody User user) {
        try {
            User updatedUser = userService.updateUser(userId, user);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @RequestMapping(value = "/users/{userId}", method = RequestMethod.DELETE)
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        try {
            userService.deleteUser(userId);
            return ResponseEntity.ok("User deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @RequestMapping(value = "/shipments", method = RequestMethod.GET)
    public ResponseEntity<?> getAllShipments() {
        try {
            List<Shipment> shipments = shipmentService.getAllShipments();
            return ResponseEntity.ok(shipments);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @RequestMapping(value = "/shipments/requested", method = RequestMethod.GET)
    public ResponseEntity<?> getRequestedShipments() {
        try {
            List<Shipment> shipments = shipmentService.getShipmentsByStatus(Shipment.ShipmentStatus.REQUESTED);
            return ResponseEntity.ok(shipments);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @RequestMapping(value = "/shipments/{shipmentId}/approve", method = RequestMethod.POST)
    public ResponseEntity<?> approveShipment(@PathVariable Long shipmentId) {
        try {
            Shipment shipment = shipmentService.approveShipment(shipmentId);
            return ResponseEntity.ok(shipment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @RequestMapping(value = "/shipments/{shipmentId}/status", method = RequestMethod.PUT)
    public ResponseEntity<?> updateShipmentStatus(@PathVariable Long shipmentId, 
                                                   @RequestParam String status) {
        try {
            Shipment.ShipmentStatus shipmentStatus = Shipment.ShipmentStatus.valueOf(status);
            Shipment shipment = shipmentService.updateShipmentStatus(shipmentId, shipmentStatus);
            return ResponseEntity.ok(shipment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @RequestMapping(value = "/payments", method = RequestMethod.GET)
    public ResponseEntity<List<Payment>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }
    
    @RequestMapping(value = "/payments/{paymentId}/status", method = RequestMethod.PUT)
    public ResponseEntity<?> updatePaymentStatus(@PathVariable Long paymentId, 
                                                  @RequestParam String status) {
        try {
            Payment.PaymentStatus paymentStatus = Payment.PaymentStatus.valueOf(status);
            Payment payment = paymentService.updatePaymentStatus(paymentId, paymentStatus);
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @RequestMapping(value = "/shipments/{shipmentId}", method = RequestMethod.DELETE)
    public ResponseEntity<?> deleteShipment(@PathVariable Long shipmentId) {
        try {
            shipmentService.deleteShipment(shipmentId);
            return ResponseEntity.ok().body(java.util.Map.of("message", "Shipment deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }
}
