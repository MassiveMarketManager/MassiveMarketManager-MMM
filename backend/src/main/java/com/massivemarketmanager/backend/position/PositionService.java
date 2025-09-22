package com.massivemarketmanager.backend.position;

import com.massivemarketmanager.backend.strategy.Strategy;
import com.massivemarketmanager.backend.strategy.StrategyRepository;
import com.massivemarketmanager.backend.user.User;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PositionService {
    private final StrategyRepository strategyRepo;
    private final PositionRepository positionRepo;

    @Transactional
    public Position createPosition(User user, CreatePositionCommandDTO c) {
        // 1) select strategy
        Strategy strategy = resolveStrategy(user, c.strategyId(), c.useDefaultStrategy());

        // 2) build entity
        Position p = Position.builder()
                .amountIn(c.amountIn())
                .tokenIn(c.tokenIn().trim().toUpperCase())
                .tokenOut(c.tokenOut().trim().toUpperCase())
                .network(c.network())
                .dex(c.dex())
                .poolAddress(c.poolAddress().trim().toLowerCase())
                .strategy(strategy)
                .build();

        return positionRepo.save(p);
    }

    private Strategy resolveStrategy(User user, Long strategyId, boolean useDefault) {
        if (strategyId != null) {
            return strategyRepo.findByIdAndUserId(strategyId, user.getId())
                    .orElseThrow(() -> new IllegalArgumentException("strategy not found or not yours"));
        }
        if (useDefault) return createDefault(user);
        throw new IllegalArgumentException("either strategyId or useDefaultStrategy must be provided");
    }

    private Strategy createDefault(User user) {
        Strategy s = Strategy.builder()
                .user(user)
                .build();
        return strategyRepo.saveAndFlush(s);
    }
}

