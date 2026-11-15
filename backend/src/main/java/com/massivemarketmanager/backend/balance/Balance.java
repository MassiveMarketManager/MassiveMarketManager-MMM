package com.massivemarketmanager.backend.balance;

import com.massivemarketmanager.backend.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

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

  @NotNull
  @PositiveOrZero
  @Column(name = "token_balance", precision = 38, scale = 18, nullable = false)
  private BigDecimal tokenBalance;

  @ManyToOne
  @JoinColumn(name = "user_id", nullable = false)
  private User user;
}
