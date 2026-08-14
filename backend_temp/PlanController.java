package com.subly.billing.controller;

import com.subly.billing.dto.plan.PlanResponse;
import com.subly.billing.service.PlanService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Public endpoints for viewing currently available subscription plans.
 */
@RestController
@RequestMapping("/api/plans")
public class PlanController {

    private final PlanService planService;

    public PlanController(PlanService planService) {
        this.planService = planService;
    }

    @GetMapping
    public List<PlanResponse> activePlans() {
        return planService.getAllActivePlans();
    }
}
