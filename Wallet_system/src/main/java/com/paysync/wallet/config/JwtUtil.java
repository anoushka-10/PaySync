package com.paysync.wallet.config;

import java.nio.charset.StandardCharsets;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;

@Component
public class JwtUtil {
    
    @Value("${jwt.secret}")
    private String jwtSecret;
    
    private SecretKey signingKey;
    
    @PostConstruct
    public void init() {
        // Use the same key generation as Auth Service
        this.signingKey = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }
    
    public Long extractUserId(String token) {
        if (token == null || token.trim().isEmpty()) {
            throw new IllegalArgumentException("Token cannot be null or empty");
        }
        
        try {
            // Use the same parsing approach as Auth Service
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(signingKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            
            return Long.parseLong(claims.getSubject());
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid JWT token: " + e.getMessage());
        }
    }
    
    public String extractUsername(String token) {
        if (token == null || token.trim().isEmpty()) {
            throw new IllegalArgumentException("Token cannot be null or empty");
        }
        
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(signingKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            
            return claims.getSubject();
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid JWT token: " + e.getMessage());
        }
    }
    
    // Optional: Keep the old method for backward compatibility
    public Long extractUserIdFromHeader(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Invalid Authorization header");
        }
        String token = authHeader.substring(7);
        return extractUserId(token);
    }
}