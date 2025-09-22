package com.massivemarketmanager.backend.auth;

import com.massivemarketmanager.backend.user.UserResponseDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    public UserResponseDto register(@Valid SignUpRequestDto request) {
        return null;
    }

    public void verifyEmail(@NotBlank String token) {
    }
    public void resendVerification(@NotBlank String email) {
    }
    public AuthResponseDto signIn(@Valid SignInRequestDto request) {
        return null;
    }
}
