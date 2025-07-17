package com.paysync.transaction.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String jwtSecret;

    public Long extractUserId(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(jwtSecret)
                .parseClaimsJws(token.replace("Bearer ", ""))
                .getBody();

        return Long.parseLong(claims.get("userId").toString());
    }
}