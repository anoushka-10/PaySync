package com.paysync.wallet.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.paysync.wallet.Dtos.AddMoneyRequest;
import com.paysync.wallet.Dtos.SendMoneyRequest;
import com.paysync.wallet.Dtos.WalletResponse;
import com.paysync.wallet.Service.WalletService;
import com.paysync.wallet.config.JwtUtil;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/wallet")
@RequiredArgsConstructor
public class WalletController {
    
    private final WalletService walletService;
    private final JwtUtil jwtUtil;
    
    @GetMapping("/me")
    public ResponseEntity<WalletResponse> getMyWallet(@RequestHeader("Authorization") String authHeader) {
        String token = extractToken(authHeader);
        Long userId = jwtUtil.extractUserId(token);
        return ResponseEntity.ok(walletService.getWallet(userId));
    }
    @PostMapping("/init")
    public ResponseEntity<WalletResponse> initWallet(@RequestHeader("Authorization") String authHeader) {
    	String token = extractToken(authHeader);
        Long userId = jwtUtil.extractUserId(token);
        return ResponseEntity.ok(walletService.createWallet(userId));
    }

    
    @PostMapping("/add")
    public ResponseEntity<WalletResponse> addMoney(@RequestHeader("Authorization") String authHeader,
                                                   @RequestHeader("Idempotency-Key") String key,
                                                   @RequestBody AddMoneyRequest request) {
        String token = extractToken(authHeader);
        Long userId = jwtUtil.extractUserId(token);
        return ResponseEntity.ok(walletService.addMoney(userId, request, key));
    }
    
    @PostMapping("/send")
    public ResponseEntity<String> sendMoney(@RequestHeader("Authorization") String authHeader,
                                            @RequestHeader("Idempotency-Key") String key,
                                            @RequestBody SendMoneyRequest request) {
        String token = extractToken(authHeader);
        Long userId = jwtUtil.extractUserId(token);
        walletService.sendMoney(userId, request, key);
        return ResponseEntity.ok("Money sent successfully");
    }
    
    // Helper method to extract token from Authorization header
    private String extractToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Invalid authorization header format");
        }
        return authHeader.substring(7);
    }
}