package com.bookify.controller.admin;

import com.bookify.dto.response.ApiResponse;
import com.bookify.dto.response.PageResponse;
import com.bookify.dto.response.auth.UserSummaryResponse;
import com.bookify.dto.response.user.UserProfileResponse;
import com.bookify.entity.UserStatus;
import com.bookify.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
@Tag(name = "Admin - Users", description = "Admin user account management and moderation")
public class AdminUserController {

    private final UserService userService;

    @GetMapping
    @Operation(summary = "List all users (paginated)")
    public ResponseEntity<ApiResponse<PageResponse<UserSummaryResponse>>> getAllUsers(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(PageResponse.of(userService.getAllUsers(pageable))));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get detailed profile of a user")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(userService.getUserProfile(id)));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update user status (ACTIVE, INACTIVE, BANNED)")
    public ResponseEntity<ApiResponse<UserSummaryResponse>> updateUserStatus(
            @PathVariable Long id,
            @RequestParam UserStatus status) {
        UserSummaryResponse response = userService.updateUserStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("User status updated", response));
    }
}
