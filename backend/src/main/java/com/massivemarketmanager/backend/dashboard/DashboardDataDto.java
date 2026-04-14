package com.massivemarketmanager.backend.dashboard;

import java.time.Instant;
import java.util.Map;

public record DashboardDataDto(
        Long userId,
        String userEmail,
        String layout,
        Map<String, String> widgets,
        Instant lastUpdated
) {}