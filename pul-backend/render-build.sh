#!/usr/bin/env bash
# exit on error
set -o errexit

# make mvnw executable
chmod +x mvnw

# build the application
./mvnw clean package -DskipTests 