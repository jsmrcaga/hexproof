npm i -g netlify-cli

NETLIFY_AUTH_TOKEN=$1
BUILD_DIRECTORY=$2
FUNCTIONS_DIRECTORY=$3

npm run build

# Export token to use with netlify's cli
export NETLIFY_AUTH_TOKEN=$NETLIFY_AUTH_TOKEN

# Deploy with netlify
netlify deploy --dir=$BUILD_DIRECTORY --functions=FUNCTIONS_DIRECTORY
