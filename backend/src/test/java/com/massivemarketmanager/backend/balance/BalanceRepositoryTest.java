package com.massivemarketmanager.backend.balance;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.massivemarketmanager.backend.user.User;
import jakarta.validation.ConstraintViolationException;
import java.math.BigDecimal;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jpa.test.autoconfigure.TestEntityManager;

@DataJpaTest
class BalanceRepositoryTest {

  @Autowired
  private BalanceRepository underTest;
  @Autowired
  private TestEntityManager entityManager;

  @Test
  void savesBalanceWithLongTokenBalanceCorrectly() {
    BigDecimal tokenBalance = new BigDecimal("0.000000000000000345");
    User user = User.builder()
        .email("random.email@gmail.com")
        .passwordHash("ahsh")
        .build();
    Balance balance = Balance.builder()
        .tokenName("ETH")
        .tokenBalance(tokenBalance)
        .user(user)
        .build();

    entityManager.persist(user);
    var savedBalance = entityManager.persist(balance);
    entityManager.flush();
    entityManager.clear();

    var foundBalance = underTest.findById(savedBalance.getId());
    assertThat(foundBalance).isPresent();
    assertThat(foundBalance.get().getTokenBalance())
        .isEqualByComparingTo(tokenBalance);
  }

  @Test
  void shouldThrowAnExceptionWhenSavingBalanceWithNegativeTokenBalance() {
    BigDecimal tokenBalance = new BigDecimal("-0.000000000000000345");
    User user = User.builder()
        .email("random.email2@gmail.com")
        .passwordHash("ahsh")
        .build();
    Balance balance = Balance.builder()
        .tokenName("USDT")
        .tokenBalance(tokenBalance)
        .user(user)
        .build();

    entityManager.persist(user);
    assertThatThrownBy(() -> entityManager.persist(balance))
        .isInstanceOf(ConstraintViolationException.class);
  }
}
