package com.bookify.controller;

import com.bookify.dto.request.user.UserProfileUpdateRequest;
import com.bookify.dto.response.ApiResponse;
import com.bookify.dto.response.dashboard.UserDashboardResponse;
import com.bookify.dto.response.user.UserProfileResponse;
import com.bookify.security.UserPrincipal;
import com.bookify.service.DashboardService;
import com.bookify.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "User profile and dashboard endpoints")
public class UserController {

    private final UserService userService;
    private final DashboardService dashboardService;

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user profile")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getCurrentUser(@AuthenticationPrincipal UserPrincipal currentUser) {
        UserProfileResponse response = userService.getUserProfile(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/me")
    @Operation(summary = "Update current authenticated user profile")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateProfile(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody UserProfileUpdateRequest request) {
        UserProfileResponse response = userService.updateProfile(currentUser.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", response));
    }

    @GetMapping("/me/dashboard")
    @Operation(summary = "Get user reading dashboard statistics and analytics")
    public ResponseEntity<ApiResponse<UserDashboardResponse>> getUserDashboard(@AuthenticationPrincipal UserPrincipal currentUser) {
        UserDashboardResponse response = dashboardService.getUserDashboard(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
