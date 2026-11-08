package com.massivemarketmanager.backend.balance;

import com.massivemarketmanager.backend.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
@Entity
@Table(
    name = "balance",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "ux_user_id_token_name",
            columnNames = {"user_id", "token_name"}
        )
    }
)
public class Balance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "token_name", nullable = false)
    private String tokenName;

    private BigDecimal tokenBalance;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
