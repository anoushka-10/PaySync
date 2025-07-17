package com.insight.auth_service.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.insight.auth_service.Models.RefreshToken;
import com.insight.auth_service.Models.User;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
	   Optional<RefreshToken> findByToken(String token);
	   
	   @Modifying
	   @Transactional
	   @Query("DELETE FROM RefreshToken r WHERE r.user = :user")
	   void deleteByUser(@Param("user") User user);
	    
}
