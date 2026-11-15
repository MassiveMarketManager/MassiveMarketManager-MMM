package com.massivemarketmanager.backend.dashboard;

import com.massivemarketmanager.backend.user.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final CurrentUserService currentUserService;
    private final DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<DashboardDataDto> getDashboard() {
        Long userId = currentUserService.getCurrentUserId();
        DashboardDataDto dashboard = dashboardService.getUserDashboard(userId);
        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Long userId = currentUserService.getCurrentUserId();
        Map<String, Object> stats = dashboardService.getUserStats(userId);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/balances")
    public ResponseEntity<Map<String, Object>> getUserBalances() {
        Long userId = currentUserService.getCurrentUserId();
        Map<String, Object> balances = dashboardService.getUserBalances(userId);
        return ResponseEntity.ok(balances);
    }
}