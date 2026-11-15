# Strategy Entity Documentation

This document describes the fields of the `Strategy` entity in the `com.massivemarketmanager.backend.strategy` package.

---

## Table Definition
- **Table name:** `strategy`  
- **Indexes:**  
  - `ix_strategy_user` → index on `user_id` (foreign key to the user)  

---

## Identification
- **`id : Long`**  
  Primary key of the strategy entity.  
  Generated using `GenerationType.IDENTITY`.

---

## Limits & Thresholds
- **`lossLimit : Double`**  
  Maximum allowed loss for the strategy.  
  - Cannot be null.  
  - Must be ≥ 0.  
  - Default: `0.1` (set by `@PrePersist` if null).  

- **`incomeLimit : Double`**  
  Target income limit for the strategy.  
  - Cannot be null.  
  - Must be ≥ 0.  
  - Default: `0.02` (set by `@PrePersist` if null).  

- **`potentialIncomeLimit : Double`**  
  Limit for potential (unrealized) income.  
  - Cannot be null.  
  - Must be ≥ 0.  
  - Default: `0.004` (set by `@PrePersist` if null).  

- **`recheckPeriod : Integer`**  
  Period (in some unit, e.g., minutes) for rechecking the strategy.  
  - Cannot be null.  
  - Must be > 0.  
  - Default: `6` (set by `@PrePersist` if null).  

---

## Relations
- **`positions : List<Position>`**  
  One-to-many relationship with the `Position` entity.  
  - Each strategy can include multiple positions.  
  - Cascade = ALL, orphan removal enabled.  
  - Default: empty list.  

- **`user : User`**  
  Many-to-one relationship with the `User` entity.  
  - Each strategy belongs to a specific user.  
  - Cannot be null.  
  - Foreign key: `fk_strategy_user`.  

---

## Concurrency
- **`version : long`**  
  Field for optimistic locking.  
  Automatically incremented by JPA.  

---

## Lifecycle Hooks
- **`@PrePersist applyDefaults()`**  
  Ensures default values are applied if fields are not explicitly set:  
  - `lossLimit = 0.1`  
  - `incomeLimit = 0.02`  
  - `potentialIncomeLimit = 0.004`  
  - `recheckPeriod = 6`  
