package com.bangura.cargo.service;

import com.bangura.cargo.model.Shipment;

import java.util.List;

public interface ShipmentService {

    Shipment createShipment(Shipment shipment, Long userId, Long productTypeId);

    Shipment approveShipment(Long shipmentId);

    Shipment updateShipmentStatus(Long shipmentId, Shipment.ShipmentStatus status);

    Shipment getShipmentById(Long id);

    Shipment getShipmentByTrackingNumber(String trackingNumber);

    List<Shipment> getAllShipments();

    List<Shipment> getShipmentsByUserId(Long userId);

    List<Shipment> getShipmentsByStatus(Shipment.ShipmentStatus status);

    Shipment updateShipment(Long shipmentId, Shipment updatedShipment);

    void deleteShipment(Long shipmentId);
}
