#!/bin/bash

echo "🚀 Starting Maintenance Management System..."

cleanup() {
    echo -e "\n🛑 Shutting down servers..."
    kill $(jobs -p) 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend
    npm install
    cd ..
fi

echo "🖥️  Starting backend server (port 3001)..."
cd backend
node server.js &
BACKEND_PID=$!

echo "⚛️  Starting frontend server (port 3000)..."
cd ..
npm run dev &
FRONTEND_PID=$!

echo "✅ Both servers are starting..."
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop both servers"

wait
