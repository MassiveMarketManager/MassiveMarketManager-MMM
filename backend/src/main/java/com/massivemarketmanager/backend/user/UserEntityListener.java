package com.massivemarketmanager.backend.user;

import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;

import java.time.LocalDateTime;

public class UserEntityListener {

    @PrePersist
    public void prePersist(User user) {
        var now = LocalDateTime.now();
        user.setCreatedAt(now);
        user.setUpdatedAt(now);
        user.setEmail(normalizeEmail(user.getEmail()));
    }

    @PreUpdate
    public void preUpdate(User user) {
        user.setUpdatedAt(LocalDateTime.now());
        user.setEmail(normalizeEmail(user.getEmail()));
    }

    private String normalizeEmail(String email) {
        return email == null ? null : email.trim().toLowerCase();
    }
}

