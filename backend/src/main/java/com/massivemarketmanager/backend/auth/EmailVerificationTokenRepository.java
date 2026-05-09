package com.massivemarketmanager.backend.auth;

import com.massivemarketmanager.backend.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.Optional;

public interface EmailVerificationTokenRepository extends JpaRepository<EmailVerificationToken, Long> {
    Optional<EmailVerificationToken> findByToken(String token);
    @Modifying
    @Query("delete from EmailVerificationToken t where t.user = :user or t.expiresAt < :now")
    void cleanupForUser(@Param("user") User user, @Param("now") Instant now);
}
