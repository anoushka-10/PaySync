package com.insight.auth_service.DTOs;

import lombok.Data;

@Data
public class RegisterRequest {
	private String username;
    private String email;
    private String password;
}
