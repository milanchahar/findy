#!/bin/bash

echo "🚀 Starting Findyy Backend Server..."
echo ""

# Kill any existing process on port 5001
echo "🔍 Checking for existing processes on port 5001..."
if lsof -ti:5001 > /dev/null 2>&1; then
  echo "⚠️  Port 5001 is in use. Killing existing process..."
  lsof -ti:5001 | xargs kill -9 2>/dev/null
  sleep 1
fi

# Navigate to backend directory
cd "$(dirname "$0")/backend" || exit 1

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

# Start the server
echo "✅ Starting server on port 5001..."
npm start
