package com.massivemarketmanager.backend.user;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CurrentUserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (principal instanceof User) {
            return (User) principal;
        }

        // Если principal не User (например, строка), загружаем из БД
        String username = principal.toString();
        return userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
    }

    public Long getCurrentUserId() {
        return getCurrentUser().getId();
    }

    public boolean isCurrentUser(Long userId) {
        return getCurrentUserId().equals(userId);
    }

    public UserResponseDto getCurrentUserDto() {
        User user = getCurrentUser();
        return userMapper.toResponseDto(user);
    }
}