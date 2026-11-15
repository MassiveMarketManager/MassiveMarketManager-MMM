package com.massivemarketmanager.backend.trade;

import com.massivemarketmanager.backend.operation.Operations;
import com.massivemarketmanager.backend.position.Position;
import com.massivemarketmanager.backend.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EqualsAndHashCode(of = "id")
@ToString(exclude = {"user", "position"})
@Entity
@Table(
        name = "trade",
        indexes = {
                @Index(name = "ix_trade_user", columnList = "user_id"),
                @Index(name = "ix_trade_position", columnList = "position_id"),
                @Index(name = "ix_trade_status", columnList = "status"),
                @Index(name = "ix_trade_created_at", columnList = "created_at")
        }
)
public class Trade {
    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "position_id", nullable = false)
    private Position position;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private TradeStatus status;

    @NotNull
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "closed_at")
    private LocalDateTime closedAt;

    // абсолютная прибыль/убыток (в токене quote), проценты
    @Column(name = "profit_abs", precision = 30, scale = 12)
    private BigDecimal profitAbs;

    @Column(name = "profit_pct", precision = 12, scale = 6)
    private BigDecimal profitPct;

    // длительность удержания сделки в секундах (рассчитывается при закрытии)
    @Column(name = "holding_period_sec")
    private Long holdingPeriodSec;

    @AssociationOverrides({
            @AssociationOverride(
                    name = "operations.buy",
                    joinColumns = @JoinColumn(name = "buy_operation_id", nullable = false, unique = true)
            ),
            @AssociationOverride(
                    name = "operations.sell",
                    joinColumns = @JoinColumn(name = "sell_operation_id", unique = true)
            )
    })
    @Embedded
    @NotNull
    private Operations operations;

    @PrePersist
    public void prePersist() {
        var now = LocalDateTime.now();
        setCreatedAt(now);
    }
}
