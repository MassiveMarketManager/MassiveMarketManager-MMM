package com.massivemarketmanager.backend.user;

import org.mapstruct.InjectionStrategy;
import org.mapstruct.*;

import java.util.List;
import java.util.Collection;
import java.util.Locale;

import static org.mapstruct.ReportingPolicy.IGNORE;

@Mapper(
        componentModel = "spring",
        injectionStrategy = InjectionStrategy.CONSTRUCTOR,
        unmappedTargetPolicy = IGNORE
)
public interface UserMapper {
    // Entity -> Summary DTO
    @Mapping(target = "id",     source = "id")
    @Mapping(target = "email",  source = "email", qualifiedByName = "normalizeEmail")
    @Mapping(target = "role",   source = "role")
    UserSummaryDto toSummaryDto(User user);

    // Request DTO -> Entity
    User toEntity(UserRequestDto userRequestDto);

    // Entity -> Response DTO
    @Mapping(target = "id",     source = "id")
    @Mapping(target = "email",  source = "email", qualifiedByName = "normalizeEmail")
    @Mapping(target = "role",   source = "role")
    UserResponseDto toResponseDto(User user);

    // Collections
    List<UserSummaryDto> toSummaryList(Collection<User> users);

    // ===== helpers =====
    @Named("normalizeEmail")
    default String normalizeEmail(String email) {
        if (email == null) return null;
        String v = email.trim();
        return v.isEmpty() ? null : v.toLowerCase(Locale.ROOT);
    }
}