#!/usr/bin/env bash

# Stop immediately on error
set -e

if [[ -z "$1" ]]; then
  $(./scripts/assumeDeveloperRole.sh)
fi

### Copy project to S3

./scripts/copyToS3.sh skipAssumeRole

### Infrastructure

cd infrastructure/

# Ensure dependencies are installed
NODE_ENV=production npm ci

# Use pulumi to deploy project
./scripts/deploy.sh
