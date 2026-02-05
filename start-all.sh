#!/bin/bash

echo "🚀 Starting Findyy - Full Stack Application"
echo "=========================================="
echo ""

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Function to cleanup on exit
cleanup() {
  echo ""
  echo "🛑 Shutting down servers..."
  lsof -ti:5001 | xargs kill -9 2>/dev/null
  lsof -ti:5176 | xargs kill -9 2>/dev/null
  exit 0
}

# Trap Ctrl+C
trap cleanup SIGINT SIGTERM

# Kill any existing processes
echo "🔍 Cleaning up existing processes..."
lsof -ti:5001 | xargs kill -9 2>/dev/null
lsof -ti:5176 | xargs kill -9 2>/dev/null
sleep 1

# Start backend in background
echo "📦 Starting Backend Server (port 5001)..."
cd "$SCRIPT_DIR/backend" || exit 1
if [ ! -d "node_modules" ]; then
  echo "   Installing backend dependencies..."
  npm install > /dev/null 2>&1
fi
npm start > /tmp/findyy-backend.log 2>&1 &
BACKEND_PID=$!
echo "   Backend PID: $BACKEND_PID"

# Wait for backend to start
sleep 3

# Check if backend started successfully
if ! curl -s http://localhost:5001/api/health > /dev/null 2>&1; then
  echo "❌ Backend failed to start. Check /tmp/findyy-backend.log"
  kill $BACKEND_PID 2>/dev/null
  exit 1
fi
echo "✅ Backend is running on http://localhost:5001"

# Start frontend in background
echo "🎨 Starting Frontend Server (port 5176)..."
cd "$SCRIPT_DIR/frontend" || exit 1
if [ ! -d "node_modules" ]; then
  echo "   Installing frontend dependencies..."
  npm install --legacy-peer-deps > /dev/null 2>&1
fi
npm run dev -- --strictPort --port 5176 > /tmp/findyy-frontend.log 2>&1 &
FRONTEND_PID=$!
echo "   Frontend PID: $FRONTEND_PID"

# Wait for frontend to start
sleep 5

echo ""
echo "✅ Both servers are running!"
echo ""
echo "📍 Backend API:  http://localhost:5001"
echo "📍 Frontend App: http://localhost:5176"
echo "📍 Health Check: http://localhost:5001/api/health"
echo ""
echo "📝 Logs:"
echo "   Backend:  tail -f /tmp/findyy-backend.log"
echo "   Frontend: tail -f /tmp/findyy-frontend.log"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for user interrupt
wait
