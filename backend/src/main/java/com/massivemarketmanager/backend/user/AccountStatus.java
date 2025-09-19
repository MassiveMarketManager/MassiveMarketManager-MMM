package com.massivemarketmanager.backend.user;

public enum AccountStatus {
    ACTIVE,
    BLOCKED,
    DELETED,
    PENDING // registered but the email wasn't confirmed
}
