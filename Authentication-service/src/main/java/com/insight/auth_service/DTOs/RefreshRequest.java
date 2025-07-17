package com.insight.auth_service.DTOs;

import lombok.Data;

@Data
public class RefreshRequest {
	private String refreshToken;
}
