package com.insight.auth_service.Security;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.insight.auth_service.Models.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;

@Service
public class JwtService {
    @Value("${jwt.secret}")
    private String secret;
    private SecretKey signingKey;
    private final long expiration = 1000 * 60 * 60; // 1 hour
    
    @PostConstruct
    public void init() {
        this.signingKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }
    
    public String generateToken(User user) {
        return Jwts.builder()
                .setSubject(user.getId().toString())  // Use user ID instead of username
                .claim("username", user.getUsername())  // Keep username as claim
                .claim("roles", user.getRole())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(signingKey, SignatureAlgorithm.HS256)
                .compact();
    }
    
    public String extractUsername(String token) {
        // Extract from claims instead of subject
        return parseToken(token).getBody().get("username", String.class);
    }
    
    public String extractUserId(String token) {
        return parseToken(token).getBody().getSubject();
    }
    
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }
    
    private boolean isTokenExpired(String token) {
        return parseToken(token).getBody().getExpiration().before(new Date());
    }
    
    private Jws<Claims> parseToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token);
    }
}