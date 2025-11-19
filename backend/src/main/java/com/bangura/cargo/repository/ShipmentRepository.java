package com.bangura.cargo.repository;

import com.bangura.cargo.model.Shipment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShipmentRepository extends JpaRepository<Shipment, Long> {
    
    @Query("SELECT s FROM Shipment s WHERE s.trackingNumber = :trackingNumber")
    Optional<Shipment> findByTrackingNumber(@Param("trackingNumber") String trackingNumber);
    
    @Query("SELECT s FROM Shipment s WHERE s.user.id = :userId")
    List<Shipment> findByUserId(@Param("userId") Long userId);
    
    @Query("SELECT s FROM Shipment s WHERE s.status = :status")
    List<Shipment> findByStatus(@Param("status") Shipment.ShipmentStatus status);
    
    @Query("SELECT s FROM Shipment s WHERE s.user.id = :userId AND s.status = :status")
    List<Shipment> findByUserIdAndStatus(@Param("userId") Long userId, @Param("status") Shipment.ShipmentStatus status);
    
    boolean existsByTrackingNumber(String trackingNumber);
}
