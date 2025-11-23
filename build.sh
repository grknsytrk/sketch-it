#!/bin/bash
# Exit on error
set -e

echo "--- STARTING BUILD SCRIPT ---"

echo "Building Client..."
cd client
# Install dev dependencies (needed for Vite)
npm install --production=false
npm run build

# Verify client build
if [ ! -d "dist" ]; then
  echo "ERROR: Client build failed! 'dist' directory missing."
  exit 1
fi
echo "Client build successful. 'dist' directory exists."

echo "Building Server..."
cd ../server
npm install
npm run build
echo "Server build successful."
