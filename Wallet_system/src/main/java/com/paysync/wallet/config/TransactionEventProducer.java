package com.paysync.wallet.config;


import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.paysync.wallet.Models.TransactionEvent;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class TransactionEventProducer {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    public void sendTransactionEvent(TransactionEvent event) {
        try {
            String message = objectMapper.writeValueAsString(event);
            kafkaTemplate.send("wallet-transactions", message);
            log.info("📤 Event sent to Kafka: {}", message);
        } catch (Exception e) {
            log.error("Failed to send transaction event", e);
        }
    }
}