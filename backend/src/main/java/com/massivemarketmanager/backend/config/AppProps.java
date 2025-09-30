package com.massivemarketmanager.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app")
public record AppProps(String frontendBaseUrl, Mail mail) {
    public record Mail(String from) {}
}