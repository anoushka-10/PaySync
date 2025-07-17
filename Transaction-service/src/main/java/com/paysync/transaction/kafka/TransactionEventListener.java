package com.paysync.transaction.kafka;


import java.time.Instant;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.paysync.transaction.entity.Transaction;
import com.paysync.transaction.entity.TransactionDocument;
import com.paysync.transaction.entity.TransactionEvent;
import com.paysync.transaction.repository.TransactionElasticRepository;
import com.paysync.transaction.repository.TransactionRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class TransactionEventListener {

    private final TransactionRepository transactionRepository;
    private final ObjectMapper objectMapper;
    private final TransactionElasticRepository elasticRepository;


    @KafkaListener(topics = "wallet-transactions", groupId = "transaction_group")
    public void consumeTransactionEvent(String message) {
        try {
            TransactionEvent event = objectMapper.readValue(message, TransactionEvent.class);
            Transaction transaction = Transaction.builder()
                    .transactionId(event.getTransactionId())
                    .fromUserId(event.getFromUserId())
                    .toUserId(event.getToUserId())
                    .amount(event.getAmount())
                    .transactionType(event.getEventType().equals("WALLET_MONEY_SENT") ? "DEBIT" : "CREDIT")
                    .timestamp(Instant.parse(event.getTimestamp()))
                    .build();
            transactionRepository.save(transaction);
            log.info("Transaction event saved: {}", event);
            // Save to Elasticsearch
            TransactionDocument doc = TransactionDocument.builder()
                    .transactionId(event.getTransactionId())
                    .fromUserId(event.getFromUserId())
                    .toUserId(event.getToUserId())
                    .amount(event.getAmount())
                    .transactionType(event.getEventType().equals("WALLET_MONEY_SENT") ? "DEBIT" : "CREDIT")
                    .timestamp(Instant.parse(event.getTimestamp()))
                    .build();
            elasticRepository.save(doc);

            log.info("Transaction event saved to Postgres and Elasticsearch");
      
        } catch (Exception e) {
            log.error("Failed to process transaction event", e);
        }
    }
}
