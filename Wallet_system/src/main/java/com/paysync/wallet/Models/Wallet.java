package com.paysync.wallet.Models;

import java.math.BigDecimal;
import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name="wallets")
public class Wallet {
	@Id
	@GeneratedValue(strategy= GenerationType.IDENTITY)
	private Long id;
	
	
	private Long userId;
	
	@Column(nullable=false)
	private BigDecimal balance;
	
//	@CreationTimestamp
//	@Temporal(TemporalType.TIMESTAMP)
//	private Date createdAt;
//	
//	@UpdateTimestamp
//	private Date updatedAt; 
	
	private Instant createdAt;
	private Instant updatedAt;
	
	@PrePersist
	protected void onCreate() {
		createdAt=Instant.now();
		updatedAt=createdAt;
	}
	 @PreUpdate
	    protected void onUpdate() {
	        updatedAt = Instant.now();
	    }
}
