#!/usr/bin/env bash
# exit on error
set -o errexit

# Install Java
apt-get update
apt-get install -y openjdk-17-jdk

# Set JAVA_HOME
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PATH=$JAVA_HOME/bin:$PATH

# make mvnw executable
chmod +x mvnw

# build the application
./mvnw clean package -DskipTests 