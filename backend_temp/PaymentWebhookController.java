package com.subly.billing.controller;

import com.subly.billing.service.PaymentWebhookService;
import com.subly.billing.dto.payment.PaymentWebhookRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/webhooks/payments")
public class PaymentWebhookController {

    private final PaymentWebhookService paymentWebhookService;

    public PaymentWebhookController(PaymentWebhookService paymentWebhookService) {
        this.paymentWebhookService = paymentWebhookService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.OK)
    public void handle(
            @RequestBody PaymentWebhookRequest request,
            @RequestHeader(value = "X-Subly-Signature", required = false) String signature,
            @RequestHeader(value = "X-Razorpay-Signature", required = false) String razorpaySignature,
            jakarta.servlet.http.HttpServletRequest httpRequest) {
        try {
            String rawBody = new String(httpRequest.getInputStream().readAllBytes(), java.nio.charset.StandardCharsets.UTF_8);
            if (razorpaySignature != null && !razorpaySignature.isBlank()) {
                paymentWebhookService.handleRazorpayWebhook(request, rawBody, razorpaySignature);
            } else {
                paymentWebhookService.handle(request, signature);
            }
        } catch (Exception e) {
            paymentWebhookService.handle(request, signature);
        }
    }
}
