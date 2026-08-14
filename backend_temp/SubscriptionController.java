package com.subly.billing.controller;

import com.subly.billing.dto.subscription.CreateSubscriptionRequest;
import com.subly.billing.dto.subscription.SubscriptionResponse;
import com.subly.billing.service.SubscriptionService;
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
 * Authenticated user endpoints for the subscription lifecycle.
 */
@RestController
@RequestMapping("/api/subscriptions")
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    public SubscriptionController(SubscriptionService subscriptionService) {
        this.subscriptionService = subscriptionService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SubscriptionResponse createSubscription(
            Authentication authentication,
            @Valid @RequestBody CreateSubscriptionRequest request) {
        return subscriptionService.createSubscription(authentication.getName(), request);
    }

    @GetMapping("/current")
    public SubscriptionResponse currentSubscription(Authentication authentication) {
        return subscriptionService.getCurrentSubscription(authentication.getName());
    }

    @GetMapping
    public List<SubscriptionResponse> subscriptionHistory(Authentication authentication) {
        return subscriptionService.getUserSubscriptions(authentication.getName());
    }

    @PostMapping("/{subscriptionId}/cancel")
    public SubscriptionResponse cancelSubscription(
            Authentication authentication,
            @PathVariable Long subscriptionId) {
        return subscriptionService.cancelSubscription(authentication.getName(), subscriptionId);
    }

    @PostMapping("/{subscriptionId}/pause")
    public SubscriptionResponse pauseSubscription(
            Authentication authentication,
            @PathVariable Long subscriptionId) {
        return subscriptionService.pauseSubscription(authentication.getName(), subscriptionId);
    }

    @PostMapping("/{subscriptionId}/resume")
    public SubscriptionResponse resumeSubscription(
            Authentication authentication,
            @PathVariable Long subscriptionId) {
        return subscriptionService.resumeSubscription(authentication.getName(), subscriptionId);
    }
}
