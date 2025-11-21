package com.bangura.cargo.service;

import com.bangura.cargo.model.ProductType;
import com.bangura.cargo.model.Shipment;
import com.bangura.cargo.model.User;
import com.bangura.cargo.repository.ProductTypeRepository;
import com.bangura.cargo.repository.ShipmentRepository;
import com.bangura.cargo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class ShipmentManager implements ShipmentService {

    @Autowired
    private ShipmentRepository shipmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductTypeRepository productTypeRepository;

    @Override
    public Shipment createShipment(Shipment shipment, Long userId, Long productTypeId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ProductType productType = productTypeRepository.findById(productTypeId)
                .orElseThrow(() -> new RuntimeException("Product type not found"));

        shipment.setUser(user);
        shipment.setProductType(productType);
        shipment.setStatus(Shipment.ShipmentStatus.REQUESTED);
        shipment.setRequestDate(LocalDateTime.now());

        return shipmentRepository.save(shipment);
    }


    @Override
    public Shipment approveShipment(Long shipmentId) {
        Shipment shipment = getShipmentById(shipmentId);
        shipment.setStatus(Shipment.ShipmentStatus.APPROVED);
        shipment.setApprovalDate(LocalDateTime.now());
        shipment.setTrackingNumber(generateTrackingNumber());
        return shipmentRepository.save(shipment);
    }


    private String generateTrackingNumber() {
        String trackingNumber;
        do {
            trackingNumber = "BGC" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        } while (shipmentRepository.existsByTrackingNumber(trackingNumber));
        return trackingNumber;
    }


    @Override
    public Shipment updateShipmentStatus(Long shipmentId, Shipment.ShipmentStatus status) {
        Shipment shipment = getShipmentById(shipmentId);
        shipment.setStatus(status);
        return shipmentRepository.save(shipment);
    }


    @Override
    public Shipment getShipmentById(Long id) {
        return shipmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shipment not found"));
    }


    @Override
    public Shipment getShipmentByTrackingNumber(String trackingNumber) {
        return shipmentRepository.findByTrackingNumber(trackingNumber)
                .orElseThrow(() -> new RuntimeException("Shipment not found with tracking number: " + trackingNumber));
    }


    @Override
    public List<Shipment> getAllShipments() {
        return shipmentRepository.findAll();
    }


    @Override
    public List<Shipment> getShipmentsByUserId(Long userId) {
        return shipmentRepository.findByUserId(userId);
    }


    @Override
    public List<Shipment> getShipmentsByStatus(Shipment.ShipmentStatus status) {
        return shipmentRepository.findByStatus(status);
    }

    @Override
    public Shipment updateShipment(Long shipmentId, Shipment updatedShipment) {
        Shipment shipment = getShipmentById(shipmentId);
        shipment.setOrigin(updatedShipment.getOrigin());
        shipment.setDestination(updatedShipment.getDestination());
        shipment.setDescription(updatedShipment.getDescription());
        shipment.setWeight(updatedShipment.getWeight());
        return shipmentRepository.save(shipment);
    }

    @Override
    public Shipment updateShipment(Shipment shipment) {
        return shipmentRepository.save(shipment);
    }

    @Override
    public void deleteShipment(Long shipmentId) {
        // Simply delete by ID - JPA will handle cascades
        if (!shipmentRepository.existsById(shipmentId)) {
            throw new RuntimeException("Shipment not found with id: " + shipmentId);
        }
        shipmentRepository.deleteById(shipmentId);
    }
}
