package com.massivemarketmanager.backend.dashboard;

import com.massivemarketmanager.backend.user.User;
import com.massivemarketmanager.backend.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;

    public DashboardDataDto getUserDashboard(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new DashboardDataDto(
                userId,
                user.getEmail(),
                "default-layout",
                Map.of("widget1", "config1", "widget2", "config2"),
                Instant.now()
        );
    }

    public Map<String, Object> getUserStats(Long userId) {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalTrades", 150);
        stats.put("activeStrategies", 5);
        stats.put("totalBalance", 10000.0);
        stats.put("userId", userId);
        return stats;
    }

    public Map<String, Object> getUserBalances(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, Object> balances = new HashMap<>();
        balances.put("userId", userId);
        balances.put("balances", user.getBalances());
        balances.put("totalValue", calculateTotalBalance(user));

        return balances;
    }

    private Double calculateTotalBalance(User user) {
        return user.getBalances().stream()
                .mapToDouble(balance -> balance.getBalance().doubleValue())
                .sum();
    }
}