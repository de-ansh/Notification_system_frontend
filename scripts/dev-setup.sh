#!/bin/bash

echo "Setting up development environment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "Error: package.json not found. Please run this script from the frontend directory."
    exit 1
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Check TypeScript installation
echo "Checking TypeScript installation..."
npx tsc --version

# Run TypeScript check
echo "Running TypeScript check..."
npx tsc --noEmit

# Run linting
echo "Running ESLint..."
npm run lint

# Test build
echo "Testing build..."
npm run build

echo "Development environment setup complete!"
echo "You can now run 'npm run dev' to start the development server." 