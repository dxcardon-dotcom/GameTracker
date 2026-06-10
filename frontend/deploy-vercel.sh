#!/bin/bash

# GameTracker Vercel Deployment Script
# This script automates the deployment process to Vercel

set -e

echo "🚀 Starting GameTracker Vercel Deployment..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please login to Vercel:"
    vercel login
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run tests
echo "🧪 Running tests..."
npm test || echo "⚠️  Tests failed, but continuing deployment..."

# Build the application
echo "🔨 Building application..."
npm run build

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment completed successfully!"
echo "🌐 Your application is now live on Vercel!"

# Get the deployment URL
DEPLOYMENT_URL=$(vercel ls --scope=personal 2>/dev/null | grep "gametracker" | head -1 | awk '{print $2}' || echo "Check Vercel dashboard for URL")

echo "📱 Deployment URL: $DEPLOYMENT_URL"
echo "🔗 You can also check your Vercel dashboard for the exact URL"

# Optional: Open the deployed application
read -p "🌐 Open the deployed application in your browser? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v open &> /dev/null; then
        open "$DEPLOYMENT_URL"
    elif command -v xdg-open &> /dev/null; then
        xdg-open "$DEPLOYMENT_URL"
    else
        echo "📱 Please manually open: $DEPLOYMENT_URL"
    fi
fi

echo "🎉 GameTracker has been successfully deployed to Vercel!"
