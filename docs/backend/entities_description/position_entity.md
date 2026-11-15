# Position Entity Documentation

This document describes the fields of the `Position` entity in the `com.massivemarketmanager.backend.position` package.

---

## Table Definition
- **Table name:** `positions`  
- **Indexes:**
  - `ix_positions_strategy` → index on `strategy_id`  
  - `ix_positions_pool` → index on `network, dex, pool_address`  
- **Unique Constraint:**  
  `ux_positions_natural` ensures uniqueness of (`strategy_id`, `token_in`, `token_out`, `network`, `dex`, `pool_address`).

---

## Identification
- **`id : Long`**  
  Primary key of the position entity.  
  Generated using `GenerationType.IDENTITY`.

---

## Token & Amount
- **`amountIn : BigDecimal`**  
  Input amount for the position.  
  - Must be positive.  
  - Precision: 38, Scale: 18.  
  - Cannot be null.

- **`tokenIn : String`**  
  Symbol of the input token.  
  - Required, max length 64.  
  - Normalized to **UPPERCASE** on insert/update.  
  - Cannot be blank.

- **`tokenOut : String`**  
  Symbol of the output token.  
  - Required, max length 64.  
  - Normalized to **UPPERCASE** on insert/update.  
  - Cannot be blank.

---

## Relations
- **`strategy : Strategy`**  
  Many-to-one relationship with the `Strategy` entity.  
  - One strategy can be linked to multiple positions.  
  - Cannot be null.  
  - Foreign key: `fk_positions_strategy`.

- **`trades : List<Trade>`**  
  One-to-many relationship with the `Trade` entity.  
  - Each position can have multiple trades.  
  - Cascade = ALL, orphan removal enabled.  
  - Default: empty list.

---

## Network & Pool
- **`network : Network`**  
  Enum representing the blockchain network (e.g., ETHEREUM, POLYGON).  
  - Stored as string.  
  - Cannot be null.

- **`dex : Dex`**  
  Enum representing the decentralized exchange (e.g., UNISWAP, SUSHISWAP).  
  - Stored as string.  
  - Cannot be null.

- **`poolAddress : String`**  
  Address of the liquidity pool.  
  - Required.  
  - Length: 42–66 characters.  
  - Must match regex `^0x[0-9a-fA-F]{40}$` for EVM addresses.  
  - Normalized to **lowercase** on insert/update.

---

## Concurrency
- **`version : long`**  
  Field for optimistic locking.  
  Automatically incremented by JPA.

---

## Lifecycle Hooks
- **`@PrePersist / @PreUpdate normalize()`**  
  Ensures consistent formatting before saving:
  - `tokenIn` → trimmed, uppercased  
  - `tokenOut` → trimmed, uppercased  
  - `poolAddress` → trimmed, lowercased
