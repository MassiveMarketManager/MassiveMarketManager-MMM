package com.massivemarketmanager.backend.user;

public record UserSummaryDto(
        Long id,
        String email,
        String role,
        String status
) {
}
