package com.massivemarketmanager.backend.auth;


import com.massivemarketmanager.backend.user.UserResponseDto;
import jakarta.mail.MessagingException;
import jakarta.security.auth.message.AuthException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final VerificationService verificationService;

    @PostMapping("/sign-up")
    public ResponseEntity<UserResponseDto> signUp(@Valid @RequestBody SignUpRequestDto request,
                                                  UriComponentsBuilder uriBuilder) throws AuthException, MessagingException {
        UserResponseDto user = authService.register(request);
        URI location = uriBuilder.path("/users/{id}").buildAndExpand(user.id()).toUri();
        return ResponseEntity.created(location).body(user);
    }

    @PostMapping("/verify")
    public ResponseEntity<Void> verify(@RequestParam("token") String token) throws AuthException {
        verificationService.verify(token);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<Void> resend(@Valid @RequestBody ResendVerificationRequest request) {
        authService.resendVerification(request.email());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/sign-in")
    public ResponseEntity<AuthResponseDto> signIn(@Valid @RequestBody SignInRequestDto request) throws AuthException {
        AuthResponseDto body = authService.signIn(request);
        return ResponseEntity.ok()
                .header(HttpHeaders.CACHE_CONTROL, "no-store")
                .body(body);
    }
}
