package com.massivemarketmanager.backend.auth;

import static org.assertj.core.api.Assertions.assertThat;

import com.massivemarketmanager.backend.user.User;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jpa.test.autoconfigure.TestEntityManager;

@DataJpaTest
class EmailVerificationTokenRepositoryTest {

  @Autowired
  private TestEntityManager entityManager;
  @Autowired
  private EmailVerificationTokenRepository underTest;

  private static final Instant NOW = Instant.now().truncatedTo(ChronoUnit.MILLIS);

  @Test
  void shouldReturnEmailVerificationTokenWhenFoundByToken() {
    var testUser = entityManager.persist(User.builder()
        .email("test@email.de")
        .passwordHash("passwordHash")
        .build());
    var savedToken = entityManager.persist(
        EmailVerificationToken.builder()
            .token("token")
            .user(testUser)
            .expiresAt(NOW.plusSeconds(360))
            .build()
    );
    entityManager.flush();
    entityManager.clear();

    var foundToken = underTest.findByToken(savedToken.getToken());
    assertThat(foundToken).isPresent();
    assertThat(foundToken.get())
        .usingRecursiveComparison()
        .ignoringFields("user")
        .isEqualTo(savedToken);
    assertThat(foundToken.get().getUser().getId()).isEqualTo(testUser.getId());
  }

  @Test
  void shouldReturnEmptyOptionalWhenTokenNotFound() {
    var testUser = entityManager.persist(User.builder()
        .email("test2@email.de")
        .passwordHash("passwordHash2")
        .build());
    entityManager.persist(
        EmailVerificationToken.builder()
            .token("token2")
            .user(testUser)
            .expiresAt(NOW.plusSeconds(360))
            .build()
    );
    entityManager.flush();
    entityManager.clear();

    var foundToken = underTest.findByToken("token1");
    assertThat(foundToken).isEmpty();
  }
}
