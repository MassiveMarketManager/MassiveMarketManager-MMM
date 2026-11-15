package com.massivemarketmanager.backend.auth;

import com.massivemarketmanager.backend.user.UserSummaryDto;

public record AuthResponseDto(
        String accessToken,      // JWT
        String refreshToken,     // ротируемый
        String tokenType,        // "Bearer"
        long expiresIn,          // сек
        UserSummaryDto user
) {
}
