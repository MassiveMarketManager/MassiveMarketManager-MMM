# ------------ Build stage ------------
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app

# Caching dependencies
COPY pom.xml .
RUN --mount=type=cache,target=/root/.m2 mvn -B -q -DskipTests dependency:go-offline

# Build
COPY src ./src
RUN --mount=type=cache,target=/root/.m2 mvn -B -DskipTests clean package

# ------------ Runtime stage ------------
FROM eclipse-temurin:21-jre AS runtime
LABEL org.opencontainers.image.title="MassiveMarketManager" \
      org.opencontainers.image.description="Spring Boot backend for MassiveMarketManager" \
      org.opencontainers.image.source="https://example.com/your-repo" \
      org.opencontainers.image.vendor="MassiveMarketManager"

# Non-root user
RUN addgroup --system app && adduser --system --ingroup app app
USER app

WORKDIR /opt/app
COPY --from=build /app/target/*.jar /opt/app/app.jar

# Container-aware JVM defaults
ENV JAVA_TOOL_OPTIONS="-XX:+ExitOnOutOfMemoryError -XX:MaxRAMPercentage=75.0 -XX:InitialRAMPercentage=25.0 -Dfile.encoding=UTF-8 -Duser.timezone=UTC"

EXPOSE 9000
ENTRYPOINT ["java","-jar","/opt/app/app.jar"]
