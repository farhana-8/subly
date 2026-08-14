package com.subly.billing.dto.plan;

import com.subly.billing.entity.BillingInterval;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

/**
 * Admin payload for creating or updating a subscription plan.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PlanRequest {

    @NotBlank(message = "Plan name is required")
    @Size(max = 255, message = "Plan name must not exceed 255 characters")
    private String name;

    @Size(max = 2000, message = "Description must not exceed 2000 characters")
    private String description;

    @NotNull(message = "Price is required")
    @PositiveOrZero(message = "Price must not be negative")
    private BigDecimal price;

    @NotNull(message = "Billing interval is required")
    private BillingInterval billingInterval;

    private boolean active = true;
}
