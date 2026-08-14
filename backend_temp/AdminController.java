package com.subly.billing.controller;

import com.subly.billing.dto.auth.UserProfileResponse;
import com.subly.billing.service.AuthService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Administrative endpoints for platform user management.
 */
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AuthService authService;

    public AdminController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/users")
    public List<UserProfileResponse> users() {
        return authService.getAllUsers();
    }
}
