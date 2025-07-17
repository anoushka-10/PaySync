package com.insight.auth_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "wallet-service")
public interface WalletClient {
	@PostMapping("/wallet/init")
    ResponseEntity<Void> createWallet(@RequestHeader("Authorization") String token);
}
