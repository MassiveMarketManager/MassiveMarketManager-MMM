package com.massivemarketmanager.backend.user;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserMapper userMapper;

    @GetMapping("/me")
    public ResponseEntity<UserResponseDto> me(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(userMapper.toResponseDto(user));
    }
}
