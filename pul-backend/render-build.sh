#!/usr/bin/env bash
# exit on error
set -o errexit

# Set JAVA_HOME to Java 17
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PATH=$JAVA_HOME/bin:$PATH

# make mvnw executable
chmod +x mvnw

# build the application
./mvnw clean package -DskipTests 