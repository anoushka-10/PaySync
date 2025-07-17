package com.insight.auth_service.Service;







import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.insight.auth_service.DTOs.AuthResponse;
import com.insight.auth_service.DTOs.LoginRequest;
import com.insight.auth_service.DTOs.RegisterRequest;
import com.insight.auth_service.Models.RefreshToken;
import com.insight.auth_service.Models.Role;
import com.insight.auth_service.Models.User;
import com.insight.auth_service.Repository.UserRepository;
import com.insight.auth_service.Security.JwtService;
import com.insight.auth_service.client.WalletClient;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
	
	@Autowired
	private WalletClient walletClient;
    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder; // 👈 this one
    private final JwtService jwtService;
    private final AuthenticationManager authManager;
    private final RefreshTokenService refreshTokenService;


    public AuthResponse register(RegisterRequest request) {
    	var user = User.builder()
    	        .username(request.getUsername())
    	        .email(request.getEmail())
    	        .password(passwordEncoder.encode(request.getPassword())) // ✅ secure
    	        .role(Role.MEMBER)
    	        .build();

        userRepo.save(user);
        String jwt = jwtService.generateToken(user);
        String refresh = refreshTokenService.createRefreshToken(user).getToken();
        try {
            walletClient.createWallet("Bearer " + jwt);
        } catch (Exception e) {
            // log and handle failure gracefully if wallet creation fails
            System.err.println("Wallet creation failed: " + e.getMessage());
        }
        return new AuthResponse(jwt, refresh);
    }

    public AuthResponse login(LoginRequest request) {
        System.out.println("🔐 Login attempt for: " + request.getUsername());
        try {
            authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );
            System.out.println("✅ Authentication passed");
        } catch (Exception e) {
            System.out.println("❌ Authentication failed: " + e.getClass().getSimpleName() + " - " + e.getMessage());
            throw e;
        }

        User user = userRepo.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found after auth"));

        String jwt = jwtService.generateToken(user);
        String refresh = refreshTokenService.createRefreshToken(user).getToken();

        return new AuthResponse(jwt, refresh);
    }


    public AuthResponse refreshToken(String token) {
        return refreshTokenService.findByToken(token)
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {
                    String newAccessToken = jwtService.generateToken(user);
                    return new AuthResponse(newAccessToken, token);
                })
                .orElseThrow(() -> new RuntimeException("Invalid refresh token"));
    }
}

