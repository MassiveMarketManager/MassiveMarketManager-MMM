package com.massivemarketmanager.backend.user;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.AssertionsForClassTypes.tuple;

import com.massivemarketmanager.backend.balance.Balance;
import java.math.BigDecimal;
import org.hibernate.exception.ConstraintViolationException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jpa.test.autoconfigure.TestEntityManager;

@DataJpaTest
class UserRepositoryTest {

  @Autowired
  private UserRepository underTest;
  @Autowired
  private TestEntityManager entityManager;

  @Test
  void shouldSaveTwoValidUsersWithSameTokens() {
    var savedUserAlice = entityManager.persist(
        User.builder()
            .email("  Alice@Example.COM ")
            .passwordHash("hash")
            .build()
    );
    var savedUserBob = entityManager.persist(
        User.builder()
            .email("Bob@Example.COM ")
            .passwordHash("hash")
            .build()
    );

    entityManager.persist(
        Balance.builder()
            .tokenName("token")
            .tokenBalance(BigDecimal.TEN)
            .user(savedUserAlice)
            .build()
    );

    entityManager.persist(
        Balance.builder()
            .tokenName("token")
            .tokenBalance(BigDecimal.ONE)
            .user(savedUserBob)
            .build()
    );

    entityManager.flush();
    entityManager.clear();

    assertThat(underTest.findAll())
        .flatExtracting(User::getBalances)
        .extracting(Balance::getTokenName, b -> b.getUser().getId())
        .containsExactlyInAnyOrder(
            tuple("token", savedUserAlice.getId()),
            tuple("token", savedUserBob.getId())
        );
  }

  @Test
  void shouldRejectSameTokenTwiceForSameUser() {
    var alice = entityManager.persist(
        User.builder().email("alice@example.com").passwordHash("hash").build());
    entityManager.persist(
        Balance.builder().tokenName("token").tokenBalance(BigDecimal.ONE).user(alice).build());
    var duplicate =
        Balance.builder().tokenName("token").tokenBalance(BigDecimal.TEN).user(alice).build();

    assertThatThrownBy(() -> entityManager.persistAndFlush(duplicate))
        .isInstanceOf(ConstraintViolationException.class)
        .extracting(e -> ((ConstraintViolationException) e).getConstraintName())
        .asString()
        .containsIgnoringCase("ux_user_id_token_name");
  }

}
