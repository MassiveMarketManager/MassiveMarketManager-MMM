package com.massivemarketmanager.backend.auth;

import com.massivemarketmanager.backend.user.User;
import jakarta.security.auth.message.AuthException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.UUID;

import static com.massivemarketmanager.backend.user.AccountStatus.ACTIVE;

@Service
@RequiredArgsConstructor
public class VerificationService {
    private final EmailVerificationTokenRepository repo;

    public String issueToken(User user) {
        repo.cleanupForUser(user, Instant.now());
        var t = new EmailVerificationToken();
        t.setToken(UUID.randomUUID().toString());
        t.setUser(user);
        t.setExpiresAt(Instant.now().plus(Duration.ofHours(24)));
        repo.save(t);
        return t.getToken();
    }

    @Transactional
    public void verify(String token) throws AuthException {
        var t = repo.findByToken(token).orElseThrow(() -> new AuthException("INVALID_TOKEN"));
        if (t.isUsed() || t.getExpiresAt().isBefore(Instant.now())) throw new AuthException("TOKEN_EXPIRED");
        var u = t.getUser();
        u.setAccountStatus(ACTIVE);
        t.setUsed(true);
        t.setUsedAt(Instant.now());
        // сохранение сделает JPA в транзакции
    }
}

