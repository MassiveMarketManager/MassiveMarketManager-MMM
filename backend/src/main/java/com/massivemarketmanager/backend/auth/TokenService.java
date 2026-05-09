package com.massivemarketmanager.backend.auth;

import com.massivemarketmanager.backend.user.User;

import java.time.Instant;

public interface TokenService {
    record AccessToken(String token, Instant expiresAt) {}
    record RefreshTokenView(String token, Instant expiresAt) {}

    AccessToken createAccessToken(User user);
    RefreshTokenView rotateRefreshToken(User user);
    boolean validateAccessToken(String token);
    Long getUserIdFromAccess(String token);
}
