package com.paysync.wallet.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.paysync.wallet.Models.Wallet;

@Repository
public interface WalletRepository extends JpaRepository<Wallet, Long> {
	 Optional<Wallet> findByUserId(Long userId);

	boolean existsByUserId(Long userId);
}
