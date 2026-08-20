# Multi-stage build for Spring Boot Backend on Render / Railway
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app
COPY backend/pom.xml .
COPY backend/src ./src
RUN apk add --no-cache maven && mvn clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/bookify-api-*.jar app.jar
RUN mkdir -p /app/data
EXPOSE 8088
ENV PORT=8088
ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
