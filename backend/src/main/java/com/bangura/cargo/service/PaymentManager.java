package com.bangura.cargo.service;

import com.bangura.cargo.model.Payment;
import com.bangura.cargo.model.Shipment;
import com.bangura.cargo.model.User;
import com.bangura.cargo.repository.PaymentRepository;
import com.bangura.cargo.repository.ShipmentRepository;
import com.bangura.cargo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class PaymentManager implements PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ShipmentRepository shipmentRepository;

    @Override
    public Payment createPayment(Payment payment, Long userId, Long shipmentId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        payment.setUser(user);

        if (shipmentId != null) {
            Shipment shipment = shipmentRepository.findById(shipmentId)
                    .orElseThrow(() -> new RuntimeException("Shipment not found"));
            payment.setShipment(shipment);
        }

        payment.setStatus(Payment.PaymentStatus.PENDING);
        payment.setPaymentDate(LocalDateTime.now());
        payment.setReference(generatePaymentReference());

        return paymentRepository.save(payment);
    }
    private String generatePaymentReference() {
        String reference;
        do {
            reference = "PAY" + UUID.randomUUID().toString().substring(0, 10).toUpperCase();
        } while (paymentRepository.existsByReference(reference));
        return reference;
    }
    @Override
    public Payment updatePaymentStatus(Long paymentId, Payment.PaymentStatus status) {
        Payment payment = getPaymentById(paymentId);
        payment.setStatus(status);
        return paymentRepository.save(payment);
    }


    @Override
    public Payment getPaymentById(Long id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
    }


    @Override
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    @Override
    public List<Payment> getPaymentsByUserId(Long userId) {
        return paymentRepository.findByUserId(userId);
    }

    @Override
    public List<Payment> getPaymentsByShipmentId(Long shipmentId) {
        return paymentRepository.findByShipmentId(shipmentId);
    }

    @Override
    public List<Payment> getPaymentsByStatus(Payment.PaymentStatus status) {
        return paymentRepository.findByStatus(status);
    }
}
