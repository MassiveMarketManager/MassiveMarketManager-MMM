package com.massivemarketmanager.backend.user;

public record UserResponseDto(
        Long id,
        String email,
        String role,
        String status
        // other fields might be added later on
) {
}
