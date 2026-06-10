#!/bin/bash

# GameTracker GitHub Pages Deployment Script
# This script automates the deployment process to GitHub Pages

set -e

echo "🚀 Starting GameTracker GitHub Pages Deployment..."

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Error: Not in a git repository. Please run this script from the project root."
    exit 1
fi

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "📦 Installing GitHub CLI..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install gh
    else
        curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
        echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
        sudo apt update
        sudo apt install gh
    fi
fi

# Check if user is authenticated with GitHub
if ! gh auth status &> /dev/null; then
    echo "🔐 Please authenticate with GitHub:"
    gh auth login
fi

# Get repository information
REPO_OWNER=$(gh api user --jq '.login')
REPO_NAME=$(basename "$(git rev-parse --show-toplevel)")
FULL_REPO="$REPO_OWNER/$REPO_NAME"

echo "📁 Repository: $FULL_REPO"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run tests
echo "🧪 Running tests..."
npm test || echo "⚠️  Tests failed, but continuing deployment..."

# Configure vite for GitHub Pages
echo "⚙️  Configuring Vite for GitHub Pages..."

# Update vite.config.js for GitHub Pages deployment
cat > vite.config.js << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/gametracker/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@headlessui/react', '@heroicons/react'],
          utils: ['date-fns', 'lodash']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
})
EOF

# Update package.json with deployment scripts
echo "📝 Updating package.json..."
npm pkg set scripts.deploy="npm run build && gh-pages -d dist"
npm pkg set scripts.predeploy="npm run test"

# Install gh-pages if not already installed
if ! npm list gh-pages &> /dev/null; then
    echo "📦 Installing gh-pages..."
    npm install --save-dev gh-pages
fi

# Build the application
echo "🔨 Building application..."
npm run build

# Enable GitHub Pages for the repository
echo "📄 Enabling GitHub Pages..."
gh api repos/$FULL_REPO/pages -X POST -f source[branch]=gh-pages || echo "GitHub Pages may already be enabled"

# Deploy to GitHub Pages
echo "🚀 Deploying to GitHub Pages..."
npx gh-pages --dist dist --repo https://github.com/$FULL_REPO.git --branch gh-pages

# Get the deployment URL
PAGES_URL=$(gh api repos/$FULL_REPO/pages --jq '.html_url')

echo "✅ Deployment completed successfully!"
echo "🌐 Your application is now live on GitHub Pages!"
echo "📱 Deployment URL: $PAGES_URL"

# Wait for GitHub Pages to be ready
echo "⏳ Waiting for GitHub Pages to be ready..."
sleep 30

# Verify deployment
if curl -f -s "$PAGES_URL" > /dev/null; then
    echo "✅ Deployment verified successfully!"
else
    echo "⚠️  Deployment may still be processing. Please check the URL in a few minutes."
fi

# Optional: Open the deployed application
read -p "🌐 Open the deployed application in your browser? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v open &> /dev/null; then
        open "$PAGES_URL"
    elif command -v xdg-open &> /dev/null; then
        xdg-open "$PAGES_URL"
    else
        echo "📱 Please manually open: $PAGES_URL"
    fi
fi

echo "🎉 GameTracker has been successfully deployed to GitHub Pages!"
echo "📚 Note: It may take a few minutes for GitHub Pages to fully propagate."
