package com.massivemarketmanager.backend.user;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.massivemarketmanager.backend.balance.Balance;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString(exclude = {"passwordHash", "encPrivateWallet", "balances", "tradeIds", "strategies", "positions"})
@EqualsAndHashCode(of = "id")
@EntityListeners(UserEntityListener.class)
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true, length = 254)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Balance> balances = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    @Column(name = "account_status", nullable = false)
    private AccountStatus accountStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "user_role", nullable = false)
    private UserRole role;

    @ElementCollection
    @CollectionTable(name = "user_trades", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "trade_id")
    @Builder.Default
    private List<Long> tradeIds = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "user_strategies", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "strategy_id")
    private List<Long> strategies;

    @Column(name = "pub_wallet_key", length = 42, unique = true)
    private String pubWalletKey; // EVM address (0x... 42 chars) - at least I think so

    @JsonIgnore
    @Column(name = "enc_private_wallet", length = 128) // base64(IV||CT||TAG)
    private String encPrivateWallet;

    @Lob
    private String preferences; // JSON строка

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "latest_login")
    private LocalDateTime latestLogin;

    @Version
    private Long version;

    @ElementCollection
    @CollectionTable(name = "user_positions", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "position_id")
    @Builder.Default
    private List<Long> positions = new ArrayList<>();
}
