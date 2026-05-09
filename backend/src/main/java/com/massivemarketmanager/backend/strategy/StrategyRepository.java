package com.massivemarketmanager.backend.strategy;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StrategyRepository extends JpaRepository<Strategy, Long> {
    Optional<Strategy> findByIdAndUserId(Long id, Long userId);
}

