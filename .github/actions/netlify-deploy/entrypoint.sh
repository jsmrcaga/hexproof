#!/bin/bash

npm i -g netlify-cli

NETLIFY_AUTH_TOKEN=$1
NETLIFY_SITE_ID=$2
BUILD_DIRECTORY=$3
FUNCTIONS_DIRECTORY=$4

# Install dependencies
npm i

# Build project
npm run build

# Export token to use with netlify's cli
export NETLIFY_SITE_ID=$NETLIFY_SITE_ID
export NETLIFY_AUTH_TOKEN=$NETLIFY_AUTH_TOKEN

# Deploy with netlify
netlify deploy --dir=$BUILD_DIRECTORY --functions=FUNCTIONS_DIRECTORY
