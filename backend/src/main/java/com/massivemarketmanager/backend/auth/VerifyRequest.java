package com.massivemarketmanager.backend.auth;

import jakarta.validation.constraints.NotBlank;

public record VerifyRequest(
        @NotBlank String token
) {
}
