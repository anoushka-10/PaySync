package com.paysync.wallet.Models;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionEvent {
    private String transactionId;
    private Long fromUserId;
    private Long toUserId;
    private BigDecimal amount;
    private String eventType; // WALLET_MONEY_SENT / WALLET_MONEY_RECEIVED
    private String timestamp;
}
