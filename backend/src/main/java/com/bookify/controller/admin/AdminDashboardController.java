package com.bookify.controller.admin;

import com.bookify.dto.response.ApiResponse;
import com.bookify.dto.response.dashboard.AdminAnalyticsResponse;
import com.bookify.dto.response.dashboard.AdminStatsResponse;
import com.bookify.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/dashboard")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
@Tag(name = "Admin - Dashboard", description = "Platform statistics, metrics, and KPI analytics")
public class AdminDashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    @Operation(summary = "Get platform KPI overview stats")
    public ResponseEntity<ApiResponse<AdminStatsResponse>> getStats() {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getAdminStats()));
    }

    @GetMapping("/analytics")
    @Operation(summary = "Get platform analytics (popular books, genre trends, user growth)")
    public ResponseEntity<ApiResponse<AdminAnalyticsResponse>> getAnalytics() {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getAdminAnalytics()));
    }
}
