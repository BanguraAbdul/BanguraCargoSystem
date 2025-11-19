package com.bangura.cargo.service;

import com.bangura.cargo.model.Payment;

import java.util.List;

public interface PaymentService {

    Payment createPayment(Payment payment, Long userId, Long shipmentId);

    Payment updatePaymentStatus(Long paymentId, Payment.PaymentStatus status);

    Payment getPaymentById(Long id);

    List<Payment> getAllPayments();

    List<Payment> getPaymentsByUserId(Long userId);

    List<Payment> getPaymentsByShipmentId(Long shipmentId);

    List<Payment> getPaymentsByStatus(Payment.PaymentStatus status);
}
