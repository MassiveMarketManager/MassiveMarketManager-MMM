package com.massivemarketmanager.backend.auth;

import com.massivemarketmanager.backend.user.User;

import java.time.Instant;
import java.util.Optional;

public interface TokenService {
  record AccessToken(String token, Instant expiresAt) {}
  record RefreshTokenView(String token, Instant expiresAt) {}

  AccessToken createAccessToken(User user);
  RefreshTokenView rotateRefreshToken(User user);
  boolean validateAccessToken(String token);
  Long getUserIdFromAccess(String token);

  /**
   * Looks up the stored record for a plaintext refresh token.
   * Returns empty when the token is unknown, already revoked or expired.
   */
  Optional<RefreshToken> resolveRefreshToken(String plainToken);

  /** Revokes every still-active refresh token belonging to the user. */
  void revokeAllRefreshTokens(Long userId);
}
