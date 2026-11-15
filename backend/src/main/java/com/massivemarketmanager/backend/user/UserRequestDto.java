package com.massivemarketmanager.backend.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UserRequestDto(
        @NotBlank @Email String email,
        @NotBlank String passwordHash
) {}
