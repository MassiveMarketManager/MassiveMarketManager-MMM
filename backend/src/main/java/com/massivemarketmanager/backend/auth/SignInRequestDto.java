package com.massivemarketmanager.backend.auth;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.*;

import java.util.UUID;
import java.util.Map;

@JsonIgnoreProperties(ignoreUnknown = true)
public record SignInRequestDto(
        @NotBlank @Email @Size(max = 254) String email,
        @NotBlank @Size(min = 8, max = 72) String password,
        @NotNull UUID deviceId,
        @Size(max = 32) Map<@NotBlank String, @Size(max = 128) String> metadata
) {}
