package com.massivemarketmanager.backend.auth;

import com.massivemarketmanager.backend.user.*;
import jakarta.mail.MessagingException;
import jakarta.security.auth.message.AuthException;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.Locale;

import static com.massivemarketmanager.backend.user.AccountStatus.*;

@Service
@RequiredArgsConstructor
public class AuthService {
  final private UserRepository userRepository;
  final private UserMapper userMapper;
  private final PasswordEncoder passwordEncoder;

  // against timing attacks
  private static final String DUMMY_BCRYPT = "$2a$10$7EqJtq98hPqEX7fNZaFWoO5XmkVUL8D67qVqXN0G8Z5T9jp/KaF2m";

  private final TokenService tokenService;

  private final VerificationService verificationService;

  private final MailService mailService;

  @Transactional
  public UserResponseDto register(@Valid SignUpRequestDto request) throws AuthException, MessagingException {
    final String email = normalizeEmail(request.email());
    final String rawPassword = request.password() == null ? "" : request.password();

    var userOpt = userRepository.findByEmail(email);
    if (userOpt.isPresent()) {
      throw new AuthException("USER_ALREADY_EXISTS");
    }

    UserRequestDto userRequestDto = new UserRequestDto(email, passwordEncoder.encode(rawPassword));

    var user = userMapper.toEntity(userRequestDto);
    userRepository.save(user);

    String token = verificationService.issueToken(user);
    mailService.sendEmailVerification(user.getEmail(), token);

    return userMapper.toResponseDto(user);
  }

  public void verifyEmail(@NotBlank String token) {}

  public void resendVerification(@NotBlank String email) {}

  public AuthResponseDto signIn(@Valid SignInRequestDto request) throws AuthException {
    final String email = normalizeEmail(request.email());
    final String rawPassword = request.password() == null ? "" : request.password();

    var userOpt = userRepository.findByEmail(email);
    if (userOpt.isEmpty()) {
      passwordEncoder.matches(rawPassword, DUMMY_BCRYPT);
      throw new AuthException("INVALID_CREDENTIALS");
    }

    var user = userOpt.get();

    if (user.getAccountStatus() == BLOCKED)     throw new AuthException("ACCOUNT_BLOCKED");
    // TODO: add processing logic if profile is safe-deleted
    if (user.getAccountStatus() == DELETED)     throw new AuthException("ACCOUNT_DELETED");
    if (user.getAccountStatus() == PENDING)     throw new AuthException("ACCOUNT_NOT_VERIFIED");

    if (!passwordEncoder.matches(rawPassword, user.getPasswordHash())) {
      throw new AuthException("INVALID_CREDENTIALS");
    }

    if (passwordEncoder.upgradeEncoding(user.getPasswordHash())) {
      user.setPasswordHash(passwordEncoder.encode(rawPassword));
      userRepository.save(user);
    }

    return issueTokens(user);
  }

  /**
   * Exchanges a refresh token for a fresh access token, rotating the refresh
   * token in the process. Reachable without a valid access token by design —
   * the whole point is that the access token has already expired.
   */
  @Transactional
  public AuthResponseDto refresh(@NotBlank String refreshToken) throws AuthException {
    var stored = tokenService.resolveRefreshToken(refreshToken)
        .orElseThrow(() -> new AuthException("INVALID_REFRESH_TOKEN"));

    var user = stored.getUser();

    // A token issued before the account was blocked/deleted must stop working.
    if (user.getAccountStatus() == BLOCKED)     throw new AuthException("ACCOUNT_BLOCKED");
    if (user.getAccountStatus() == DELETED)     throw new AuthException("ACCOUNT_DELETED");
    if (user.getAccountStatus() == PENDING)     throw new AuthException("ACCOUNT_NOT_VERIFIED");

    return issueTokens(user);
  }

  /**
   * Revokes the user's refresh tokens. Deliberately silent when the token is
   * unknown or already revoked, so signing out twice is not an error.
   */
  @Transactional
  public void logout(String refreshToken) {
    tokenService.resolveRefreshToken(refreshToken)
        .ifPresent(rt -> tokenService.revokeAllRefreshTokens(rt.getUser().getId()));
  }

  private AuthResponseDto issueTokens(User user) {
    var access = tokenService.createAccessToken(user);   // -> { token(), expiresAt() }
    var refresh = tokenService.rotateRefreshToken(user); // -> { token() }

    return new AuthResponseDto(
        access.token(),
        refresh.token(),
        "Bearer",
        Math.max(0, Duration.between(Instant.now(), access.expiresAt()).getSeconds()),
        userMapper.toSummaryDto(user)
    );
  }

  private static String normalizeEmail(String email) {
    return email == null ? "" : email.trim().toLowerCase(Locale.ROOT);
  }
}
