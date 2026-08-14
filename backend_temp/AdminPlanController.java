package com.subly.billing.controller;

import com.subly.billing.dto.plan.PlanRequest;
import com.subly.billing.dto.plan.PlanResponse;
import com.subly.billing.service.PlanService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Administrative endpoints for managing subscription plans.
 */
@RestController
@RequestMapping("/api/admin/plans")
public class AdminPlanController {

    private final PlanService planService;

    public AdminPlanController(PlanService planService) {
        this.planService = planService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PlanResponse createPlan(@Valid @RequestBody PlanRequest request) {
        return planService.createPlan(request);
    }

    @PutMapping("/{planId}")
    public PlanResponse updatePlan(
            @PathVariable Long planId,
            @Valid @RequestBody PlanRequest request) {
        return planService.updatePlan(planId, request);
    }

    @DeleteMapping("/{planId}")
    public PlanResponse deactivatePlan(@PathVariable Long planId) {
        return planService.deactivatePlan(planId);
    }

    @GetMapping
    public List<PlanResponse> allPlans() {
        return planService.getAllPlansForAdmin();
    }
}
