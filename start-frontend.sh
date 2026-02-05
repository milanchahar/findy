#!/bin/bash

echo "🚀 Starting Findyy Frontend Server..."
echo ""

# Kill any existing process on port 5176
echo "🔍 Checking for existing processes on port 5176..."
if lsof -ti:5176 > /dev/null 2>&1; then
  echo "⚠️  Port 5176 is in use. Killing existing process..."
  lsof -ti:5176 | xargs kill -9 2>/dev/null
  sleep 1
fi

# Navigate to frontend directory
cd "$(dirname "$0")/frontend" || exit 1

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install --legacy-peer-deps
fi

# Start the server
echo "✅ Starting dev server on port 5176..."
npm run dev -- --strictPort --port 5176
