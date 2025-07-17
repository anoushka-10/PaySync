package com.insight.auth_service.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.insight.auth_service.Models.User;

@Repository
public interface UserRepository extends JpaRepository<User,Long>{


	Optional<User> findByUsername(String username);

}
