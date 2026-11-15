package com.massivemarketmanager.backend.persistence;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.massivemarketmanager.backend.operation.BuyOperation;
import com.massivemarketmanager.backend.operation.Operations;
import com.massivemarketmanager.backend.position.Dex;
import com.massivemarketmanager.backend.position.Network;
import com.massivemarketmanager.backend.position.Position;
import com.massivemarketmanager.backend.strategy.Strategy;
import com.massivemarketmanager.backend.strategy.StrategyRepository;
import com.massivemarketmanager.backend.trade.Trade;
import com.massivemarketmanager.backend.trade.TradeStatus;
import com.massivemarketmanager.backend.user.User;
import com.massivemarketmanager.backend.user.UserRepository;
import jakarta.validation.ConstraintViolationException;
import java.math.BigDecimal;
import java.math.BigInteger;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jpa.test.autoconfigure.TestEntityManager;

@DataJpaTest
class PersistenceChainTest {

  @Autowired
  TestEntityManager entityManager;
  @Autowired
  UserRepository userRepository;
  @Autowired
  StrategyRepository strategyRepository;

  @Test
  void shouldSaveUserStrategyPositionTradeWithBuyOperationAndReadThemBackWhenEntitiesCorrect() {
    User user = entityManager.persist(
        User.builder()
          .email("  Alice@Example.COM ")
          .passwordHash("hash")
          .build()
    );

    Strategy strategy = Strategy.builder()
        .name("scalp")
        .lossLimit(0.1)
        .incomeLimit(0.02)
        .potentialIncomeLimit(0.004)
        .recheckPeriod(6)
        .user(user)
        .build();

    Position position = Position.builder()
        .amountIn(new BigDecimal("1.5"))
        .tokenIn("weth").tokenOut("usdc")
        .network(Network.ETHEREUM).dex(Dex.UNISWAP)
        .poolAddress("0x88E6A0c2dDD26FEEb64F039a2c41296FcB3f5640")
        .strategy(strategy)
        .build();
    strategy.getPositions().add(position);

    BuyOperation buy = new BuyOperation();
    buy.setSlippageBps(50);
    buy.setFilledAmountIn(new BigDecimal("0"));
    buy.setReceivedAmountOut(new BigDecimal("4500"));
    buy.setGasPrice(BigInteger.valueOf(20_000_000_000L));

    Trade trade = Trade.builder()
        .user(user)
        .position(position)
        .status(TradeStatus.OPEN)
        .operations(
            Operations.builder()
                .buy(buy)
                .build())
        .build();
    position.getTrades().add(trade);

    Long strategyId = entityManager.persistAndGetId(strategy, Long.class);
    entityManager.flush();
    entityManager.clear();

    assertThat(userRepository.findByEmail("alice@example.com")).isPresent();

    var loadedStrategy = strategyRepository.findByIdAndUserId(strategyId, user.getId());
    assertThat(loadedStrategy).isPresent();
    assertThat(loadedStrategy.get().getPositions()).singleElement().satisfies(p -> {
      assertThat(p.getTokenIn()).isEqualTo("WETH");
      assertThat(p.getPoolAddress()).isEqualTo("0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640");
      assertThat(p.getTrades()).singleElement().satisfies(t -> {
        assertThat(t.getStatus()).isEqualTo(TradeStatus.OPEN);
        assertThat(t.getCreatedAt()).isNotNull();
        assertThat(t.getOperations().getBuy()).isInstanceOf(BuyOperation.class);
        assertThat(t.getOperations().getBuy().getReceivedAmountOut())
            .isEqualByComparingTo("4500");
        assertThat(t.getOperations().getSell()).isNull();
      });
    });
  }

  @Test
  void shouldThrowAnExceptionWhenPersistingInvalidStrategy() {
    User user = entityManager.persist(
        User.builder()
            .email("bob@example.com")
            .passwordHash("hash")
            .build()
    );
    Strategy invalid = Strategy.builder()
        .name("bad")
        .lossLimit(0.1)
        .incomeLimit(0.02)
        .potentialIncomeLimit(0.004)
        .recheckPeriod(0)
        .user(user)
        .build();

    assertThatThrownBy(() ->
        entityManager.persistAndFlush(invalid)).isInstanceOf(ConstraintViolationException.class);
  }
}
