package com.paysync.transaction.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;

import java.math.BigDecimal;
import java.time.Instant;

@Document(indexName = "transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionDocument {

    
   
    @Id
    private String transactionId;
    private Long fromUserId;
    private Long toUserId;
    private BigDecimal amount;
    private String transactionType;
    private Instant timestamp;
}
