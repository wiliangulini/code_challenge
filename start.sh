#!/bin/bash

echo "🚀 Iniciando o Sistema de Gerenciamento de Manutenção..."

cleanup() {
    echo -e "\n🛑 Desligando servidores..."
    kill $(jobs -p) 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências do frontend..."
    npm install
fi

if [ ! -d "backend/node_modules" ]; then
    echo "📦  Instalando dependências do backend..."
    cd backend
    npm install
    cd ..
fi

echo "🖥️  Iniciando o servidor backend (porta 3001)..."
cd backend
node server.js &
BACKEND_PID=$!

echo "⚛️  Iniciando o servidor frontend (porta 3000)..."
cd ..
npm run dev &
FRONTEND_PID=$!

echo "✅ Ambos os servidores estão iniciando..."
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:3001"
echo ""
echo "Pressione Ctrl+C para parar os dois servidores"

wait
