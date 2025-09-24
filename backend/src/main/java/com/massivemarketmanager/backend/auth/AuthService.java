package com.massivemarketmanager.backend.auth;

import com.massivemarketmanager.backend.user.UserMapper;
import com.massivemarketmanager.backend.user.UserRepository;
import com.massivemarketmanager.backend.user.UserResponseDto;
import com.massivemarketmanager.backend.user.UserSummaryDto;
import jakarta.security.auth.message.AuthException;
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

    public UserResponseDto register(@Valid SignUpRequestDto request) {
        return null;
    }

    public void verifyEmail(@NotBlank String token) {
    }
    public void resendVerification(@NotBlank String email) {
    }
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
