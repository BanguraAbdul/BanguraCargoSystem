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
    
    @NotBlank(message = "Origin is required")
    @Column(nullable = false)
    private String origin;
    
    @NotBlank(message = "Destination is required")
    @Column(nullable = false)
    private String destination;
    
    @Column(length = 1000)
    private String description;
    
    @NotNull(message = "Weight is required")
    @Column(nullable = false)
    private Double weight;
    
    @Column(unique = true)
    private String trackingNumber;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ShipmentStatus status = ShipmentStatus.REQUESTED;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime requestDate = LocalDateTime.now();
    
    private LocalDateTime approvalDate;
    
    @OneToMany(mappedBy = "shipment", cascade = CascadeType.ALL)
    @JsonIgnoreProperties({"shipment", "user"})
    private List<Payment> payments;
    
    public enum ShipmentStatus {
        REQUESTED, APPROVED, IN_TRANSIT, DELIVERED, CANCELLED
    }
}
