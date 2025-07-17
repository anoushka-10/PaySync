package com.insight.auth_service.Models;




import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;



@Entity
@Data
@Table(name="users")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id @GeneratedValue
    private Long id;
    
    @Column(unique=true, nullable=false)
    private String username;
    private String password;
    private String email;

    @Enumerated(EnumType.STRING)
    private Role role; // ADMIN, MEMBER
}
