package com.insight.auth_service.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.insight.auth_service.Models.RefreshToken;
import com.insight.auth_service.Models.User;
import com.insight.auth_service.Repository.RefreshTokenRepository;
import com.insight.auth_service.Repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepo;
    private final UserRepository userRepo;

    @Value("${jwt.refresh.expiration}") // e.g., 7 days
    private Long refreshTokenDurationMs;
    
    @Transactional
    public RefreshToken createRefreshToken(User user) {
        refreshTokenRepo.deleteByUser(user); // Ensure one active token per user
        RefreshToken token = RefreshToken.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .expiryDate(Instant.now().plusMillis(refreshTokenDurationMs))
                .build();

        return refreshTokenRepo.save(token);
    }
    @Transactional
    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepo.delete(token);
            throw new RuntimeException("Refresh token expired. Please log in again.");
        }
        return token;
    }

    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepo.findByToken(token);
    }
}
