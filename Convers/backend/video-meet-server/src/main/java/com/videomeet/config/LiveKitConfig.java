package com.videomeet.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class LiveKitConfig {

    public static final String API_KEY = "devkey";
    public static final String API_SECRET = "secret";

    @Bean
    public LiveKitProperties liveKitProperties() {
        return new LiveKitProperties(API_KEY, API_SECRET);
    }

    public record LiveKitProperties(String apiKey, String apiSecret) {
    }
}