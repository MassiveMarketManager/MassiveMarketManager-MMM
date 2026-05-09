// TokenServiceImpl.java
package com.massivemarketmanager.backend.auth;

import com.massivemarketmanager.backend.user.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TokenServiceImpl implements TokenService {

    private final RefreshTokenRepository refreshRepo;
    private final PasswordEncoder passwordEncoder;

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
        String hash  = passwordEncoder.encode(plain);        // в БД кладём ХЭШ

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

    private static String generateSecureToken() {
        byte[] buf = new byte[32]; // 256 бит
        new SecureRandom().nextBytes(buf);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(buf);
    }
}
