package com.paysync.wallet.Dtos;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SendMoneyRequest {
    private Long toUserId;
    private BigDecimal amount;
}
