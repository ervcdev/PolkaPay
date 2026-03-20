#!/bin/bash

# PolkaPay Local Hardhat Development Node Startup Script
# Alternative to Docker - uses Hardhat's built-in development node

set -e

echo "🚀 Starting PolkaPay Local Hardhat Development Node"
echo "================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not available. Please install npm."
    exit 1
fi

echo "✅ Node.js and npm are available"

# Install hardhat globally if not present
if ! command -v hardhat &> /dev/null; then
    echo "📦 Installing Hardhat globally..."
    npm install -g hardhat
fi

# Kill any existing process on port 8545
echo "🛑 Stopping any existing processes on port 8545..."
lsof -ti:8545 | xargs kill -9 2>/dev/null || true

# Start Hardhat node in background
echo "🔄 Starting Hardhat development node..."
npx hardhat node --hostname 0.0.0.0 --port 8545 &
HARDHAT_PID=$!

# Wait for the node to be ready
echo "⏳ Waiting for node to be ready..."
sleep 5

# Check if the node is responding
echo "🔍 Checking node health..."
for i in {1..30}; do
    if curl -s -X POST -H "Content-Type: application/json" \
       --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
       http://localhost:8545 > /dev/null 2>&1; then
        echo "✅ Local Hardhat node is ready!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ Node failed to start after 30 attempts"
        kill $HARDHAT_PID 2>/dev/null || true
        exit 1
    fi
    echo "   Attempt $i/30 - waiting..."
    sleep 2
done

echo ""
echo "🎉 LOCAL HARDHAT DEVELOPMENT ENVIRONMENT READY!"
echo "=============================================="
echo "📡 EVM RPC Endpoint: http://localhost:8545"
echo "🔗 Chain ID: 31337 (Hardhat default)"
echo "💰 Pre-funded accounts available"
echo ""
echo "🔧 NEXT STEPS:"
echo "1. 📝 Deploy contracts: npm run deploy:local"
echo "2. 🌐 Start frontend: npm run dev"
echo "3. 🧪 Test PolkaPay functionality locally"
echo ""
echo "📋 USEFUL COMMANDS:"
echo "   Stop node: kill $HARDHAT_PID"
echo "   View accounts: npx hardhat accounts"
echo "   Reset: rm -rf cache artifacts && npx hardhat clean"
echo ""
echo "💡 This local environment provides 10,000 ETH per account"
echo "   and eliminates all external dependencies."
echo ""
echo "🔄 Node PID: $HARDHAT_PID (save this to stop the node later)"
