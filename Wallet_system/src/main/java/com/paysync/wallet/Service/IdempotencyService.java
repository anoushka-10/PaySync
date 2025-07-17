package com.paysync.wallet.Service;

import java.time.Instant;

import org.springframework.stereotype.Service;

import com.paysync.wallet.Models.IdempotencyKey;
import com.paysync.wallet.Repository.IdempotencyKeyRepository;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class IdempotencyService {

    private final IdempotencyKeyRepository keyRepository;

    public void checkwhatOrSaveKey(String key, Long userId, String endpoint) {
        boolean exists = keyRepository.findByKeyAndUserId(key, userId).isPresent();
        if (exists) {
            throw new IllegalStateException("Duplicate request detected with idempotency key");
        }
        IdempotencyKey idempotencyKey = IdempotencyKey.builder()
                .key(key)
                .userId(userId)
                .endpoint(endpoint)
                .createdAt(Instant.now())
                .build();
        keyRepository.save(idempotencyKey);
    }
}
