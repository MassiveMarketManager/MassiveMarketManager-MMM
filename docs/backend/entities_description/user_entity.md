# User Entity Specification

## Required fields
- `id: UUID` — unique identifier of the user.  
- `firstName: String` — first name.  
- `lastName: String` — last name.  
- `email: String` — unique e-mail, used as login.  
- `passwordHash: String` — hashed password.  
- `balance: Decimal(18,2)` — current balance in the base currency (e.g., USDC).  
- `createdAt: Timestamp` — registration date and time.  

## Authentication & security
- `lastLogin: Timestamp` — last login timestamp.  
- `status: Enum(active, banned, deleted)` — account state.  
- `role: Enum(user, admin)` — access level.  

## Trading activity
- `tradeIds: Array<UUID>` or a relation to the trades table — list of user’s trades.  
- `strategies: Array<UUID>` or a separate strategies table — one or multiple strategies.  

## Financial parameters
- `currency: String` — code of the balance currency (e.g., "USDC", "ETH").  
- `walletAddress: String` — blockchain wallet address (if stored).  
- `apiKeys: JSON` — exchange/contract API keys (encrypted).  

## Settings
- `strategyParams: JSON` — trading strategy parameters (flexible format).  
- `preferences: JSON` — user preferences (UI, notifications, etc.).  

## Audit
- `updatedAt: Timestamp` — last profile update.  
- `deletedAt: Timestamp | null` — deletion date, if using soft delete.  
