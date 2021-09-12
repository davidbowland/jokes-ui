#!/bin/sh

# Stop immediately on error
set -e

if [[ -z "$1" ]]; then
  $(./scripts/assumeDeveloperRole.sh)
fi

# Deploy code by copying build output to S3
cd public
aws s3 sync . s3://jokes-ui-source/jokes-ui --delete --metadata-directive REPLACE --cache-control "max-age=31536000" --acl public-read --exclude "index.html"
aws s3 sync . s3://jokes-ui-source/jokes-ui --metadata-directive REPLACE --cache-control "no-cache" --acl public-read --include "index.html"
