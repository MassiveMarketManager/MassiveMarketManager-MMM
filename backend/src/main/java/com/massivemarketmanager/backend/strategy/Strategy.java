package com.massivemarketmanager.backend.strategy;

import com.massivemarketmanager.backend.position.Position;
import com.massivemarketmanager.backend.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.*;

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
@Table(
        name = "strategy",
        indexes = {
                @Index(name = "ix_strategy_user", columnList = "user_id")
        },
        uniqueConstraints = {
                @UniqueConstraint(name = "ux_strategy_user_name", columnNames = {"user_id", "name"})
        }
)
public class Strategy {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Size(max = 100)
    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @NotNull
    @PositiveOrZero
    @Column(nullable = false)
    private Double lossLimit;

    @NotNull
    @PositiveOrZero
    @Column(nullable = false)
    private Double incomeLimit;

    @NotNull
    @PositiveOrZero
    @Column(nullable = false)
    private Double potentialIncomeLimit;

    @NotNull
    @Positive
    @Column(nullable = false)
    private Integer recheckPeriod; // Uint

    @Builder.Default
    @ToString.Exclude
    @OneToMany(mappedBy = "strategy", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Position> positions = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_strategy_user"))
    @ToString.Exclude
    private User user;

    @Version
    private long version;

    // Internal flag to determine whether to substitute auto-name after INSERT
    @Transient
    @ToString.Exclude
    private boolean autoNameRequested;

    @PrePersist
    void applyDefaults() {
        if (lossLimit == null) lossLimit = 0.1d;
        if (incomeLimit == null) incomeLimit = 0.02d;
        if (potentialIncomeLimit == null) potentialIncomeLimit = 0.004d;
        if (recheckPeriod == null) recheckPeriod = 6;

        if (name != null) {
            name = name.trim();
        }
        if (name == null || name.isEmpty()) {
            name = "strategy";
            autoNameRequested = true;
        }
    }

    @PostPersist
    void ensureAutoName() {
        if (autoNameRequested && id != null) {
            this.name = "strategy_" + id;
            // Hibernate will usually make an update on a commit via dirty checking
        }
    }

    @PreUpdate
    void normalizeOnUpdate() {
        if (name != null) name = name.trim();
    }
}
