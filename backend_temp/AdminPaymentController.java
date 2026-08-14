package com.subly.billing.controller;

import com.subly.billing.dto.payment.AdminPaymentResponse;
import com.subly.billing.dto.payment.RevenueResponse;
import com.subly.billing.service.PaymentService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Administrative payment records and successful-revenue reporting.
 */
@RestController
@RequestMapping("/api/admin/payments")
public class AdminPaymentController {

    private final PaymentService paymentService;

    public AdminPaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping
    public List<AdminPaymentResponse> payments() {
        return paymentService.getAllPaymentsForAdmin();
    }

    @GetMapping("/revenue")
    public RevenueResponse successfulRevenue(@RequestParam(defaultValue = "INR") String currency) {
        return paymentService.calculateSuccessfulRevenue(currency);
    }

    @PostMapping("/{paymentId}/refund")
    public com.subly.billing.dto.payment.PaymentResponse requestRefund(@PathVariable Long paymentId) {
        return paymentService.requestRefundAsAdmin(paymentId);
    }
}
