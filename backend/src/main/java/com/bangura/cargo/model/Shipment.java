package com.bangura.cargo.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "shipments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Shipment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"shipments", "payments", "password"})
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "product_type_id", nullable = false)
    @JsonIgnoreProperties({"shipments"})
    private ProductType productType;
    
    // Sender Information
    private String senderName;
    private String senderPhone;
    private String senderEmail;
    
    // Origin Information
    @NotBlank(message = "Origin country is required")
    @Column(nullable = false)
    private String originCountry;
    
    @NotBlank(message = "Origin city is required")
    @Column(nullable = false)
    private String originCity;
    
    @NotBlank(message = "Origin address is required")
    @Column(nullable = false)
    private String originAddress;
    
    private String originPostalCode;
    
    // For backward compatibility
    @NotBlank(message = "Origin is required")
    @Column(nullable = false)
    private String origin;
    
    // Recipient Information
    private String recipientName;
    private String recipientPhone;
    private String recipientEmail;
    
    // Destination Information
    @NotBlank(message = "Destination country is required")
    @Column(nullable = false)
    private String destinationCountry;
    
    @NotBlank(message = "Destination city is required")
    @Column(nullable = false)
    private String destinationCity;
    
    @NotBlank(message = "Destination address is required")
    @Column(nullable = false)
    private String destinationAddress;
    
    private String destinationPostalCode;
    
    // For backward compatibility
    @NotBlank(message = "Destination is required")
    @Column(nullable = false)
    private String destination;
    
    // Package Details
    @Column(length = 1000)
    private String description;
    
    @NotNull(message = "Weight is required")
    @Column(nullable = false)
    private Double weight;
    
    private Integer quantity;
    
    // Dimensions
    private Double length;
    private Double width;
    private Double height;
    
    // Additional Information
    private Double declaredValue;
    private Boolean insurance;
    private Boolean fragile;
    
    @Column(length = 500)
    private String specialInstructions;
    
    @Column(unique = true)
    private String trackingNumber;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ShipmentStatus status = ShipmentStatus.REQUESTED;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime requestDate = LocalDateTime.now();
    
    private LocalDateTime approvalDate;
    
    @OneToMany(mappedBy = "shipment", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties({"shipment", "user"})
    private List<Payment> payments;
    
    public enum ShipmentStatus {
        REQUESTED, APPROVED, IN_TRANSIT, DELIVERED, CANCELLED
    }
}
