package com.massivemarketmanager.backend.position;

import com.massivemarketmanager.backend.strategy.Strategy;
import com.massivemarketmanager.backend.trade.Trade;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EqualsAndHashCode(of = "id")
@ToString
@Entity
// had to name it "positions" because postgres already has a function called "POSITION"
@Table(
        name = "positions",
        indexes = {
                @Index(name = "ix_positions_strategy", columnList = "strategy_id"),
                @Index(name = "ix_positions_pool", columnList = "network,dex,pool_address")
        },
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "ux_positions_natural",
                        columnNames = {"strategy_id","token_in","token_out","network","dex","pool_address"}
                )
        }
)
public class Position {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NonNull
    @Positive
    @Column(name = "amount_in", nullable = false, precision = 38, scale = 18)
    private BigDecimal amountIn;

    @NotBlank
    @Size(max = 64)
    @Column(name = "token_in", nullable = false, length = 64)
    private String tokenIn;

    @NotBlank
    @Size(max = 64)
    @Column(name = "token_out", nullable = false, length = 64)
    private String tokenOut;

    // one strategy can be applied to multiple positions
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "strategy_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_positions_strategy")
    )
    @ToString.Exclude
    private Strategy strategy;

    @OneToMany(mappedBy = "position", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    @Builder.Default
    private List<Trade> trades = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Network network;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Dex dex;

    @NotBlank
    @Size(min = 42, max = 66)
    @Pattern(regexp = "^0x[0-9a-fA-F]{40}$") // if EVM-address
    @Column(name = "pool_address", nullable = false, length = 66)
    private String poolAddress;

    @Version
    private long version;

    @PrePersist
    @PreUpdate
    void normalize() {
        if (tokenIn != null)  tokenIn  = tokenIn.trim().toUpperCase();
        if (tokenOut != null) tokenOut = tokenOut.trim().toUpperCase();
        if (poolAddress != null) poolAddress = poolAddress.trim().toLowerCase();
    }
}
