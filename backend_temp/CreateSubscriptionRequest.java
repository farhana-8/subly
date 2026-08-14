package com.subly.billing.dto.subscription;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Request to enroll the authenticated user in an active plan.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateSubscriptionRequest {

    @NotNull(message = "Plan id is required")
    private Long planId;

    private boolean autoRenew;
}
