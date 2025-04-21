#!/usr/bin/env bash
# exit on error
set -o errexit

# Download and install Java
wget https://download.java.net/java/GA/jdk17.0.2/dfd4a8d0985749f896bed50d7138ee7f/8/GPL/openjdk-17.0.2_linux-x64_bin.tar.gz
tar xzf openjdk-17.0.2_linux-x64_bin.tar.gz
export JAVA_HOME=$PWD/jdk-17.0.2
export PATH=$JAVA_HOME/bin:$PATH

# make mvnw executable
chmod +x mvnw

# build the application
./mvnw clean package -DskipTests 