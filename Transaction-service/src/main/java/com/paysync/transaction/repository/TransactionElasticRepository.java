package com.paysync.transaction.repository;

import java.util.List;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import com.paysync.transaction.entity.TransactionDocument;

@Repository
public interface TransactionElasticRepository extends ElasticsearchRepository<TransactionDocument, String> {
    List<TransactionDocument> findByFromUserIdOrToUserId(Long fromUserId, Long toUserId);

}