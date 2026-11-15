package com.massivemarketmanager.backend.operation;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(of = "id")
@ToString
@Entity
@Table(
        name = "operations",
        indexes = {
                @Index(name = "ix_operations_tx_hash", columnList = "tx_hash"),
                @Index(name = "ix_operations_created_at", columnList = "created_at")
        }
)
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "op_type", length = 8)
public abstract class Operation {
    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private Long id;

    @NotNull
    @PositiveOrZero
    @Column(name = "slippage_bps", nullable = false)
    private Integer slippageBps;

    @NotNull
    @PositiveOrZero
    @Column(name = "filled_amount_in", precision = 38, scale = 18, nullable = false)
    private BigDecimal filledAmountIn;

    @NotNull
    @PositiveOrZero
    @Column(name = "received_amount_out", precision = 38, scale = 18, nullable = false)
    private BigDecimal receivedAmountOut;

    @Column(name = "tx_hash", length = 66, unique = true)
    private String txHash; // 0x + 64 hex

    @PositiveOrZero
    @Column(name = "gas_used")
    private BigInteger gasUsed; // nullable

    @NotNull
    @PositiveOrZero
    @Column(name = "gas_price", nullable = false)
    private BigInteger gasPrice;

    @NotNull
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    private void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now(ZoneOffset.UTC);
        }
        if (txHash != null) {
            txHash = txHash.trim().toLowerCase();
        }
    }
}
