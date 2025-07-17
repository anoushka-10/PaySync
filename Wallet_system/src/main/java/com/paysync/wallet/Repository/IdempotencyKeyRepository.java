package com.paysync.wallet.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.paysync.wallet.Models.IdempotencyKey;

public interface IdempotencyKeyRepository extends JpaRepository<IdempotencyKey, String> {
    Optional<IdempotencyKey> findByKeyAndUserId(String key, Long userId);
}
