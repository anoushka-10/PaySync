package com.paysync.wallet.Models;

import java.time.Instant;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IdempotencyKey {

    @Id
    private String key;

    private Long userId;

    private Instant createdAt;

    private String endpoint;
}