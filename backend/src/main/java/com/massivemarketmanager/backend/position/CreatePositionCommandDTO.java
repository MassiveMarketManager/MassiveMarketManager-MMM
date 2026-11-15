package com.massivemarketmanager.backend.position;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record CreatePositionCommandDTO(
        @NotNull @Positive BigDecimal amountIn,
        @NotBlank String tokenIn,
        @NotBlank String tokenOut,
        @NotNull Integer chainId,
        @NotNull Network network,
        @NotNull Dex dex,
        @NotBlank String poolAddress,
        Long strategyId // nullable → null == “default”
) {
    public boolean useDefaultStrategy() {
        return strategyId == null;
    }
}
