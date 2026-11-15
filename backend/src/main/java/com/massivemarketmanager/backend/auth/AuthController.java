package com.massivemarketmanager.backend.auth;


import com.massivemarketmanager.backend.user.CurrentUserService;
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
  private final CurrentUserService currentUserService;

  /**
   * Registers user and returns the created resource location
   */
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

  @PostMapping("/refresh")
  public ResponseEntity<AuthResponseDto> refresh(@Valid @RequestBody RefreshRequestDto request) throws AuthException {
    AuthResponseDto body = authService.refresh(request.refreshToken());
    return ResponseEntity.ok()
        .header(HttpHeaders.CACHE_CONTROL, "no-store")
        .body(body);
  }

  @PostMapping("/logout")
  public ResponseEntity<Void> logout(@Valid @RequestBody RefreshRequestDto request) {
    authService.logout(request.refreshToken());
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/me")
  public ResponseEntity<UserResponseDto> getCurrentUser() {
    UserResponseDto userDto = currentUserService.getCurrentUserDto();
    return ResponseEntity.ok(userDto);
  }
}
