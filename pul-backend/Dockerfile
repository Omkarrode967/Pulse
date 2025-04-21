# Use Java 17 as the base image
FROM openjdk:17-slim

# Set working directory
WORKDIR /app

# Copy the Maven wrapper and pom.xml
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Make Maven wrapper executable
RUN chmod +x mvnw

# Copy source code
COPY src src

# Build the application
RUN ./mvnw clean package -DskipTests

# Run the application
CMD ["java", "-jar", "target/pulse-0.0.1-SNAPSHOT.jar"] 