package com.paysync.config; // Or your appropriate config package e.g., com.paysync.config

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

@Configuration
public class CorsConfig {

    @Bean
    public CorsWebFilter corsWebFilter() {
        
        CorsConfiguration corsConfig = new CorsConfiguration();
        // --- THIS IS THE FIX ---
        // We changed Collections.singletonList to List.of and added your Vercel URL.
        // This now allows requests from BOTH your live site and your local development environment.
        corsConfig.setAllowedOrigins(List.of(
            "https://pay-sync-kappa.vercel.app",
            "http://localhost:3000"
        ));

        corsConfig.setMaxAge(3600L);
        corsConfig.addAllowedMethod("*");
        corsConfig.addAllowedHeader("*");
        corsConfig.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);

        return new CorsWebFilter(source);
    }
}
