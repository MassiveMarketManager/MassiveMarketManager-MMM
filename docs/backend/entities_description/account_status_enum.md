# AccountStatus Enum Documentation

The `AccountStatus` enum represents the lifecycle state of a user account in the system.

---

## Values

### `ACTIVE`
- The account is **enabled** and fully functional.  
- The user can log in, perform trades, and interact with the system.  
- This is the **default** state for new accounts.

---

### `BLOCKED`
- The account is **temporarily disabled**.  
- The user cannot log in or perform actions.  
- Typically used in cases of:
  - Security incidents (e.g., suspicious activity)
  - Policy violations
  - Manual administrative lock

---

### `DELETED`
- The account has been **marked as deleted**.  
- The user cannot log in or access the system.  
- Data may still exist in the database for auditing or compliance, but the account is considered inactive.  
- Used for **soft deletion** rather than immediate removal of all user data.

---
