# Operation Entity Documentation

The `Operation` class is an **abstract base entity** in the `com.massivemarketmanager.backend.operation` package.  
It defines common attributes for blockchain operations (e.g., buy/sell transactions) and is extended by concrete subclasses.  

---

## Table Definition
- **Table name:** `operations`  
- **Indexes:**  
  - `ix_operations_tx_hash` → index on `tx_hash`  
  - `ix_operations_created_at` → index on `created_at`  
- **Inheritance strategy:** `JOINED`  
- **Discriminator column:** `op_type` (length = 8)  

---

## Identification
- **`id : Long`**  
  Primary key of the operation entity.  
  Generated using `GenerationType.IDENTITY`.  

---

## Trade Parameters
- **`slippageBps : Integer`**  
  Slippage in **basis points (bps)**.  
  - Cannot be null.  
  - Must be ≥ 0.  

- **`filledAmountIn : BigDecimal`**  
  Actual input amount filled during execution.  
  - Precision: 38, Scale: 18.  
  - Cannot be null.  
  - Must be ≥ 0.  

- **`receivedAmountOut : BigDecimal`**  
  Actual output amount received after execution.  
  - Precision: 38, Scale: 18.  
  - Cannot be null.  
  - Must be ≥ 0.  

---

## Transaction Metadata
- **`txHash : String`**  
  Transaction hash.  
  - Format: `0x` + 64 hex characters (66 chars total).  
  - Unique.  
  - Normalized to **lowercase** at persistence.  
  - Optional (may be null before confirmation).  

- **`gasUsed : BigInteger`**  
  Gas consumed by the transaction.  
  - Nullable.  
  - Must be ≥ 0 if present.  

- **`gasPrice : BigInteger`**  
  Gas price at the time of the transaction.  
  - Cannot be null.  
  - Must be ≥ 0.  

---

## Timestamps
- **`createdAt : LocalDateTime`**  
  Creation timestamp of the operation record.  
  - Cannot be null.  
  - Immutable after insert.  
  - Automatically set to **current UTC time** if not provided.  

---

## Lifecycle Hooks
- **`@PrePersist prePersist()`**  
  - Sets `createdAt` to the current UTC time if not already set.  
  - Normalizes `txHash` by trimming and converting to lowercase before insert.  
