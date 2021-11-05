#!/usr/bin/env bash

# Stop immediately on error
set -e

if [[ -z "$1" ]]; then
  $(./scripts/assumeDeveloperRole.sh)
fi

### Deploy code by copying build output to S3

cd public
# Cache "forever" (one year)
aws s3 sync . s3://jokes-ui-source/jokes-ui --exclude "*.html" --exclude "*.json" --exclude "*.xml" \
  --metadata-directive REPLACE --cache-control "public, max-age=31536000, immutable" --acl public-read
# Do not cache
aws s3 sync . s3://jokes-ui-source/jokes-ui --include "*.html" --include "*.json" --include "*.xml" \
  --metadata-directive REPLACE --cache-control "public, no-cache" --acl public-read
# Cleanup unused files
aws s3 sync . s3://jokes-ui-source/jokes-ui --delete
