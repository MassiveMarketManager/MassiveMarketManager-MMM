package com.massivemarketmanager.backend.auth;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
  @Modifying
  @Query("update RefreshToken t set t.revoked = true where t.user.id = :userId and t.revoked = false")
  int revokeAllByUserId(Long userId);

  /**
   * Loads a token by its hash together with the owning user, so callers can read
   * the user outside the JPA session without tripping lazy initialisation.
   */
  @Query("select t from RefreshToken t join fetch t.user where t.tokenHash = :tokenHash")
  Optional<RefreshToken> findByTokenHashWithUser(@Param("tokenHash") String tokenHash);
}
