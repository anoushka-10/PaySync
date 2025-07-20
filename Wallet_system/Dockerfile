# Start with a base Java image
FROM openjdk:17-jdk-slim

# Set a working directory inside the container
WORKDIR /app

# Copy the compiled JAR file from your project's target folder into the container
COPY target/*.jar app.jar

# Expose the port for this service (NEEDS TO BE EDITED)
EXPOSE 8083

# The command to run when the container starts
ENTRYPOINT ["java", "-jar", "app.jar"]
