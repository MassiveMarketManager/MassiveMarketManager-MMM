package com.massivemarketmanager.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

import java.io.IOException;

@Configuration
public class SpaWebConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**") // всё статикай/роуты
                .addResourceLocations("classpath:/static/")
                .resourceChain(true)
                .addResolver(new PathResourceResolver() {
                    @Override
                    protected Resource getResource(String resourcePath, Resource location) throws IOException, IOException {
                        // 1) API/service – pass to the backend (no SPA fallback)
                        if (resourcePath.startsWith("api/")
                                || resourcePath.startsWith("actuator/")
                                || resourcePath.startsWith("v3/api-docs")
                                || resourcePath.startsWith("swagger-ui")) {
                            return null;
                        }
                        // 2) If an existing file (JS/CSS/images) is requested, return the file
                        Resource requested = location.createRelative(resourcePath);
                        if (requested.exists() && requested.isReadable()) {
                            return requested;
                        }
                        // 3) Any path WITHOUT a dot (not an asset) – return index.html for React Router
                        if (!resourcePath.contains(".")) {
                            return location.createRelative("index.html");
                        }
                        // 4) Otherwise, do not intercept (useful for 404 errors on real files)
                        return null;
                    }
                });
    }
}

