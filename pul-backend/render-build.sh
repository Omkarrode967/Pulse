#!/usr/bin/env bash
# exit on error
set -o errexit

# Build the Docker image
docker build -t pulse-backend . 