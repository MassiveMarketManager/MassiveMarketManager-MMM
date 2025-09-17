# Trade Entity Documentation

This document describes the fields of the `Trade` entity in the `com.massivemarketmanager.backend.trade` package.

---

## Table Definition
- **Table name:** `trade`  
- **Indexes:**  
  - `ix_trade_user` → index on `user_id`  
  - `ix_trade_position` → index on `position_id`  
  - `ix_trade_status` → index on `status`  
  - `ix_trade_created_at` → index on `created_at`  

---

## Identification
- **`id : Long`**  
  Primary key of the trade entity.  
  Generated using `GenerationType.IDENTITY`.

---

## Relations
- **`user : User`**  
  Many-to-one relationship with the `User` entity.  
  - Cannot be null.  
  - Stored in column `user_id`.  

- **`position : Position`**  
  Many-to-one relationship with the `Position` entity.  
  - Cannot be null.  
  - Stored in column `position_id`.  

- **`operations : Operations`**  
  Embedded entity representing buy/sell operations linked to the trade.  
  - Cannot be null.  
  - Associations:  
    - `buy_operation_id` → not null, unique  
    - `sell_operation_id` → optional, unique  

---

## Status
- **`status : TradeStatus`**  
  Enum representing the current state of the trade (e.g., OPEN, CLOSED).  
  - Cannot be null.  
  - Stored as string (max length: 16).  

---

## Timestamps
- **`createdAt : LocalDateTime`**  
  Time when the trade was created.  
  - Cannot be null.  
  - Immutable after insert.  
  - Automatically set on insert by `@PrePersist`.  

- **`closedAt : LocalDateTime`**  
  Time when the trade was closed.  
  - Optional.  

---

## Profit & Performance
- **`profitAbs : BigDecimal`**  
  Absolute profit/loss in quote token.  
  - Precision: 30, Scale: 12.  
  - Optional.  

- **`profitPct : BigDecimal`**  
  Profit/loss percentage.  
  - Precision: 12, Scale: 6.  
  - Optional.  

- **`holdingPeriodSec : Long`**  
  Duration of the trade in seconds (calculated at closing).  
  - Optional.  

---

## Lifecycle Hooks
- **`@PrePersist prePersist()`**  
  - Automatically sets `createdAt` to the current timestamp before persisting.  
