# User Entity Documentation

This document describes the fields of the `User` entity in the `com.massivemarketmanager.backend.user` package, grouped by category.  
The entity uses a **`UserEntityListener`** to manage timestamps and normalize email values automatically.

---

## Identification
- **`id : Long`**  
  Primary key of the user entity. Generated using `GenerationType.IDENTITY`.

- **`username : String`**  
  Unique username of the user. Cannot be null.

- **`email : String`**  
  Unique email address. Maximum length: 254 characters. Cannot be null.  
  - **Normalization rule:** On insert/update, the email is trimmed and converted to lowercase by `UserEntityListener`.

---

## Authentication & Security
- **`passwordHash : String`**  
  Hashed password of the user, stored in column `password_hash`. Excluded from `toString()`.

- **`pubWalletKey : String`**  
  Public wallet key (EVM address, `0x...`, 42 characters). Unique, optional.

- **`encPrivateWallet : String`**  
  Encrypted private wallet key, stored as base64 (`IV||CT||TAG`). Ignored in JSON, excluded from `toString()`.

---

## Account & Role
- **`accountStatus : AccountStatus`**  
  Enum representing the status of the account. Cannot be null.

- **`role : UserRole`**  
  Enum representing the role of the user. Cannot be null.

---

## Financial & Trading Data
- **`balances : List<Balance>`**  
  User’s balances across currencies. Cascade = ALL, orphan removal enabled. Default: empty.

- **`tradeIds : List<Long>`**  
  IDs of trades linked to the user. Stored in `user_trades`. Default: empty.

- **`strategies : List<Long>`**  
  IDs of trading strategies linked to the user. Stored in `user_strategies`.

- **`positions : List<Long>`**  
  IDs of positions linked to the user. Stored in `user_positions`. Default: empty.

---

## Preferences & Settings
- **`preferences : String`**  
  JSON string with user preferences. Stored as a `Lob`.

---

## Audit & Lifecycle Timestamps
- **`createdAt : LocalDateTime`**  
  Creation timestamp. Cannot be null.  
  - **Set automatically** on insert by `UserEntityListener`.

- **`updatedAt : LocalDateTime`**  
  Last update timestamp. Cannot be null.  
  - **Set automatically** on insert and update by `UserEntityListener`.

- **`deletedAt : LocalDateTime`**  
  Soft deletion timestamp. Optional.

- **`latestLogin : LocalDateTime`**  
  Last login timestamp. Optional.

---

## Concurrency
- **`version : Long`**  
  Version field for optimistic locking. Automatically managed.
