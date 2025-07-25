package com.paysync.transaction.controller;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.paysync.transaction.config.JwtUtil;
import com.paysync.transaction.dto.PaginatedResponse;
import com.paysync.transaction.entity.Transaction;
import com.paysync.transaction.repository.TransactionRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/transaction")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionRepository transactionRepo;
    private final JwtUtil jwtUtil;

    @GetMapping
    public ResponseEntity<PaginatedResponse<Transaction>> getUserTransactions(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        String token = extractToken(authHeader);
        Long userId = jwtUtil.extractUserId(token); 

        Pageable pageable = PageRequest.of(page, size, Sort.by("timestamp").descending());
        Page<Transaction> transactionPage = transactionRepo.findByFromUserIdOrToUserId(userId, userId, pageable);

        PaginatedResponse<Transaction> response = new PaginatedResponse<>(
                transactionPage.getContent(),
                transactionPage.getNumber(),
                transactionPage.getSize(),
                transactionPage.getTotalElements(),
                transactionPage.getTotalPages(),
                transactionPage.isLast()
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTransactionById(@RequestHeader("Authorization") String token,
                                                @PathVariable Long id) {
        Long userId = jwtUtil.extractUserId(token);

        return transactionRepo.findById(id)
                .map(tx -> {
                    if (tx.getFromUserId().equals(userId) || tx.getToUserId().equals(userId)) {
                        return ResponseEntity.ok(tx);
                    } else {
                        return ResponseEntity.status(403).body("Forbidden: Access denied");
                    }
                })
                .orElseGet(() -> ResponseEntity.status(404).body("Transaction not found"));
    }
    private String extractToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Invalid authorization header format");
        }
        return authHeader.substring(7);
    }

}
