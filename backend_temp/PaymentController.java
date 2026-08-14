package com.subly.billing.controller;

import com.subly.billing.dto.payment.CreatePaymentRequest;
import com.subly.billing.dto.payment.PaymentResponse;
import com.subly.billing.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Authenticated user endpoints for recording and viewing their payments.
 */
@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PaymentResponse createPayment(
            Authentication authentication,
            @Valid @RequestBody CreatePaymentRequest request) {
        return paymentService.createPayment(authentication.getName(), request);
    }

    @PostMapping("/{paymentId}/success")
    public PaymentResponse markPaymentSuccessful(
            Authentication authentication,
            @PathVariable Long paymentId) {
        return paymentService.markPaymentSuccessful(authentication.getName(), paymentId);
    }

    @PostMapping("/verify-razorpay")
    public PaymentResponse verifyRazorpayPayment(
            Authentication authentication,
            @Valid @RequestBody com.subly.billing.dto.payment.VerifyRazorpayPaymentRequest request) {
        return paymentService.verifyRazorpayPayment(authentication.getName(), request);
    }

    @PostMapping("/{paymentId}/fail")
    public PaymentResponse markPaymentFailed(
            Authentication authentication,
            @PathVariable Long paymentId) {
        return paymentService.markPaymentFailed(authentication.getName(), paymentId);
    }

    @PostMapping("/{paymentId}/refund")
    public PaymentResponse requestRefund(Authentication authentication, @PathVariable Long paymentId) {
        return paymentService.requestRefund(authentication.getName(), paymentId);
    }

    @GetMapping
    public List<PaymentResponse> paymentHistory(Authentication authentication) {
        return paymentService.getUserPayments(authentication.getName());
    }

    @GetMapping("/{paymentId}")
    public PaymentResponse payment(Authentication authentication, @PathVariable Long paymentId) {
        return paymentService.getPayment(authentication.getName(), paymentId);
    }
}
