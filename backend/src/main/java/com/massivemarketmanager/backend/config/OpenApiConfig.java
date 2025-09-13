package com.massivemarketmanager.backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("MMM API")
                        .version("0.1.0")
                        .description("API documentation for MMM backend")
                        .contact(new Contact()
                                .name("Nikolai Milenko")
                                .url("https://github.com/nikolai-milenko")
                                .email("nikolay.milenko@gmail.com")
                        )
                );
    }
}