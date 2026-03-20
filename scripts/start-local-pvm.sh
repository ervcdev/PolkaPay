#!/bin/bash

# PolkaPay Local PVM Development Node Startup Script
# This script starts a local Polkadot Revive development node for testing

set -e

echo "🚀 Starting PolkaPay Local PVM Development Environment"
echo "=================================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "   Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not available. Please install Docker Compose."
    exit 1
fi

echo "✅ Docker and Docker Compose are available"

# Stop any existing containers
echo "🛑 Stopping any existing Polkadot Revive containers..."
docker-compose down 2>/dev/null || true

# Pull the latest image
echo "📥 Pulling latest Polkadot Revive development image..."
docker pull parity/polkadot-revive-dev:latest

# Start the development node
echo "🔄 Starting Polkadot Revive development node..."
docker-compose up -d

# Wait for the node to be ready
echo "⏳ Waiting for node to be ready..."
sleep 10

# Check if the node is responding
echo "🔍 Checking node health..."
for i in {1..30}; do
    if curl -s -f http://localhost:8545 > /dev/null 2>&1; then
        echo "✅ Local PVM node is ready!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ Node failed to start after 30 attempts"
        echo "📋 Checking logs..."
        docker-compose logs polkadot-revive-dev
        exit 1
    fi
    echo "   Attempt $i/30 - waiting..."
    sleep 2
done

echo ""
echo "🎉 LOCAL PVM DEVELOPMENT ENVIRONMENT READY!"
echo "============================================"
echo "📡 EVM RPC Endpoint: http://localhost:8545"
echo "🌐 Substrate WebSocket: ws://localhost:9944"
echo "🔗 Substrate HTTP RPC: http://localhost:9933"
echo ""
echo "🔧 NEXT STEPS:"
echo "1. 📝 Update frontend/.env.development to use local node"
echo "2. 🚀 Deploy contracts: npm run deploy:local"
echo "3. 🌐 Start frontend: npm run dev"
echo "4. 🧪 Test PolkaPay functionality locally"
echo ""
echo "📋 USEFUL COMMANDS:"
echo "   View logs: docker-compose logs -f polkadot-revive-dev"
echo "   Stop node: docker-compose down"
echo "   Restart: ./scripts/start-local-pvm.sh"
echo ""
echo "💡 This local environment provides unlimited test tokens"
echo "   and eliminates dependency on Westend Revive public faucet."
