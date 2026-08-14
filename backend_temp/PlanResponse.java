package com.subly.billing.dto.plan;

import com.subly.billing.entity.BillingInterval;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Safe API representation of a subscription plan.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlanResponse {

    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private BillingInterval billingInterval;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
