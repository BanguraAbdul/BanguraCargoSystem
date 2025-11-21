package com.bangura.cargo.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "shipment_statuses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShipmentStatus {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "shipment_id", nullable = false)
    @JsonIgnoreProperties({"statuses", "user", "payments"})
    private Shipment shipment;
    
    @Column(nullable = false)
    private String status;
    
    @Column(length = 500)
    private String description;
    
    @Column(nullable = false)
    private LocalDateTime timestamp = LocalDateTime.now();
    
    private String location;
}
