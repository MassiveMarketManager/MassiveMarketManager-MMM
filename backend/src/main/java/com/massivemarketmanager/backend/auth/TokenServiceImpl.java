// TokenServiceImpl.java
package com.massivemarketmanager.backend.auth;

import com.massivemarketmanager.backend.user.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.HexFormat;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TokenServiceImpl implements TokenService {

  private final RefreshTokenRepository refreshRepo;

  @Value("${security.jwt.secret}")          // минимум 256 бит (32 байта) base64url
  private String jwtSecretB64;
  @Value("${security.jwt.issuer:mmm}")
  private String issuer;
  @Value("${security.jwt.access-ttl-seconds:900}") // 15 мин
  private long accessTtlSec;
  @Value("${security.jwt.refresh-ttl-days:30}")    // 30 дней
  private long refreshTtlDays;

  private SecretKey key() {
    byte[] bytes = Base64.getUrlDecoder().decode(jwtSecretB64);
    return Keys.hmacShaKeyFor(bytes);
  }

  @Override
  public AccessToken createAccessToken(User user) {
    Instant now = Instant.now();
    Instant exp = now.plusSeconds(accessTtlSec);

    String token = Jwts.builder()
        .id(UUID.randomUUID().toString())
        .issuer(issuer)
        .subject(String.valueOf(user.getId()))
        .issuedAt(java.util.Date.from(now))
        .expiration(java.util.Date.from(exp))
        .claim("email", user.getEmail())
        .claim("role", user.getRole()) // если нужно
        .signWith(key(), Jwts.SIG.HS256)
        .compact();

    return new AccessToken(token, exp);
  }

  @Override
  @Transactional
  public RefreshTokenView rotateRefreshToken(User user) {
    refreshRepo.revokeAllByUserId(user.getId());

    Instant now = Instant.now();
    Instant exp = now.plus(Duration.ofDays(refreshTtlDays));

    String plain = generateSecureToken();                // плейн уходит клиенту
    String hash  = sha256Hex(plain);                     // в БД кладём ХЭШ

    RefreshToken rt = RefreshToken.builder()
        .user(user)
        .tokenHash(hash)
        .expiresAt(exp)
        .createdAt(now)
        .revoked(false)
        .build();

    refreshRepo.save(rt);
    return new RefreshTokenView(plain, exp);
  }

  @Override
  public boolean validateAccessToken(String token) {
    try {
      Jwts.parser().verifyWith(key()).build().parseSignedClaims(token);
      return true;
    } catch (JwtException | IllegalArgumentException e) {
      return false;
    }
  }

  @Override
  public Long getUserIdFromAccess(String token) {
    var claims = Jwts.parser().verifyWith(key()).build().parseSignedClaims(token).getPayload();
    return Long.parseLong(claims.getSubject());
  }

  @Override
  public Optional<RefreshToken> resolveRefreshToken(String plainToken) {
    if (plainToken == null || plainToken.isBlank()) {
      return Optional.empty();
    }
    return refreshRepo.findByTokenHashWithUser(sha256Hex(plainToken))
        .filter(rt -> !rt.isRevoked())
        .filter(rt -> rt.getExpiresAt().isAfter(Instant.now()));
  }

  @Override
  @Transactional
  public void revokeAllRefreshTokens(Long userId) {
    refreshRepo.revokeAllByUserId(userId);
  }

  private static String generateSecureToken() {
    byte[] buf = new byte[32]; // 256 бит
    new SecureRandom().nextBytes(buf);
    return Base64.getUrlEncoder().withoutPadding().encodeToString(buf);
  }

  /**
   * Refresh tokens are 256-bit random values, so a plain digest is enough here —
   * there is no low-entropy secret to brute force. Unlike BCrypt it is
   * deterministic, which is what makes looking a token up by its hash possible.
   */
  private static String sha256Hex(String value) {
    try {
      MessageDigest digest = MessageDigest.getInstance("SHA-256");
      return HexFormat.of().formatHex(digest.digest(value.getBytes(StandardCharsets.UTF_8)));
    } catch (NoSuchAlgorithmException e) {
      throw new IllegalStateException("SHA-256 is not available", e);
    }
  }
}
