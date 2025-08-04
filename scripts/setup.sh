#!/bin/bash

# Setup script for the notification system frontend

echo "Setting up notification system frontend..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Install Tailwind CSS if not already installed
echo "Ensuring Tailwind CSS is installed..."
npm install tailwindcss@latest autoprefixer@latest postcss@latest

# Initialize Tailwind CSS if config doesn't exist
if [ ! -f "tailwind.config.js" ]; then
    echo "Initializing Tailwind CSS..."
    npx tailwindcss init -p
fi

# Build the project
echo "Building the project..."
npm run build

echo "Setup complete!" 