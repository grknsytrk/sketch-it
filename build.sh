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

# Verify server build
if [ ! -d "dist" ]; then
  echo "ERROR: Server build failed! 'dist' directory missing."
  exit 1
fi

# Copy Client build to Server public directory for serving
echo "Copying client build to server/dist/public..."
mkdir -p dist/public
cp -r ../client/dist/* dist/public/

echo "Server build and asset copy successful."
