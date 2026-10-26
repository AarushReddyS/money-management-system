# Multi-stage Dockerfile for Spring Boot Application
# Optimized for Render deployment

# Build stage
FROM maven:3.9.6-eclipse-temurin-17-alpine AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests -B

# Run stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Render passes the port in $PORT environment variable
ENV PORT=8080
EXPOSE ${PORT}

# Run the Spring Boot application with memory optimizations for cloud free tiers
ENTRYPOINT ["sh", "-c", "java -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Dserver.port=${PORT} -jar app.jar"]

