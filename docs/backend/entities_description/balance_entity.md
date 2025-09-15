# Balance Entity Documentation

This document describes the fields of the `Balance` entity in the `com.massivemarketmanager.backend.balance` package.

---

## Identification
- **`id : Long`**  
  Primary key of the balance entity.  
  Generated using `GenerationType.IDENTITY`.

---

## Token Information
- **`tokenName : String`**  
  Name of the token/currency (e.g., `USDT`, `BTC`, `ETH`).  
  - Stored in column `token_name`.  
  - Cannot be null.  
  - Must be unique (per table).  

---

## Balance Value
- **`balance : BigDecimal`**  
  Numeric value representing the amount of the token owned by the user.  
  - Can be null if no balance is recorded yet.  
  - Uses `BigDecimal` to ensure precision in financial calculations.

---

## Relations
- **`user : User`**  
  Many-to-one relationship with the `User` entity.  
  - Stored in column `user_id`.  
  - Cannot be null (each balance must belong to a specific user).  
  - Defines ownership of the balance record.

---
