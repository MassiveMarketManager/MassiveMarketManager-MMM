package com.massivemarketmanager.backend.auth;

import jakarta.validation.constraints.NotBlank;

public record RefreshRequestDto(
    @NotBlank String refreshToken
) {
}
