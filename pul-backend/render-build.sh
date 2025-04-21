#!/usr/bin/env bash
# exit on error
set -o errexit

# Check if Java is installed
if ! command -v java &> /dev/null; then
    echo "Java is not installed. Installing Java 17..."
    apt-get update
    apt-get install -y openjdk-17-jdk
fi

# Set JAVA_HOME
export JAVA_HOME=$(readlink -f /usr/bin/java | sed "s:/bin/java::")
export PATH=$JAVA_HOME/bin:$PATH

# Verify Java version
java -version

# make mvnw executable
chmod +x mvnw

# build the application
./mvnw clean package -DskipTests 