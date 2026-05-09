package com.massivemarketmanager.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.http.CacheControl;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.EncodedResourceResolver;
import org.springframework.web.servlet.resource.PathResourceResolver;

import java.io.IOException;
import java.time.Duration;

@Configuration
public class SpaWebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        // 1) Long-cached asset (it is recommended to place the build in /static/assets)
        registry.addResourceHandler("/assets/**")
                .addResourceLocations("classpath:/static/assets/")
                .setCacheControl(CacheControl.maxAge(Duration.ofDays(365)).cachePublic())
                .resourceChain(true)
                .addResolver(new EncodedResourceResolver())
                .addResolver(new PathResourceResolver());

        // 2) SPA fallback and short caching for index.html
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/")
                .setCacheControl(CacheControl.noCache())
                .resourceChain(true)
                .addResolver(new EncodedResourceResolver())
                .addResolver(new PathResourceResolver() {
                    @Override
                    protected Resource getResource(String resourcePath, Resource location) throws IOException {
                        // Clear exceptions — pass them to controllers/actuators/swaggers
                        if (resourcePath.startsWith("api/")
                                || resourcePath.startsWith("actuator/")
                                || resourcePath.startsWith("v3/api-docs")
                                || resourcePath.equals("swagger-ui.html")
                                || resourcePath.startsWith("swagger-ui/")
                                || resourcePath.startsWith("assets/")
                        ) {
                            return null;
                        }
                        // If the file actually exists, we return it
                        Resource requested = location.createRelative(resourcePath);
                        if (requested.exists() && requested.isReadable()) {
                            return requested;
                        }
                        // Otherwise — SPA fallback
                        return location.createRelative("index.html");
                    }
                });
    }
}
