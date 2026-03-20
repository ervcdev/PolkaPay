/**
 * Kodapay Local PVM Deployment Script
 * 
 * This script deploys Kodapay contracts to a local Polkadot Revive development node.
 * It's designed to work with unlimited test tokens and provides a stable environment
 * for development and demonstration purposes.
 */

const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Deploying Kodapay to Local PVM Development Node...");
  console.log("📡 Network:", hre.network.name);
  console.log("⏰ Timestamp:", new Date().toISOString());
  
  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("🔑 Deploying with account:", deployer.address);
  
  // Check balance (should have unlimited tokens in local dev)
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "DEV");
  
  // Deploy MockUSDT first
  console.log("\n📄 Deploying MockUSDT...");
  const MockUSDT = await hre.ethers.getContractFactory("MockUSDT");
  const mockUSDT = await MockUSDT.deploy();
  
  await mockUSDT.waitForDeployment();
  const mockUSDTAddress = await mockUSDT.getAddress();
  console.log("✅ MockUSDT deployed to:", mockUSDTAddress);
  
  // Deploy Kodapay
  console.log("\n💰 Deploying Kodapay...");
  const Kodapay = await hre.ethers.getContractFactory("Kodapay");
  const kodapay = await Kodapay.deploy(mockUSDTAddress);
  
  await kodapay.waitForDeployment();
  const kodapayAddress = await kodapay.getAddress();
  console.log("✅ Kodapay deployed to:", kodapayAddress);
  
  // Mint test tokens (large amount for local testing)
  console.log("\n🪙 Minting test tokens for local development...");
  const mintAmount = hre.ethers.parseUnits("1000000", 6); // 1M USDT for testing
  const mintTx = await mockUSDT.faucet(deployer.address, mintAmount);
  await mintTx.wait();
  
  const deployerBalance = await mockUSDT.balanceOf(deployer.address);
  console.log(`✅ Minted ${hre.ethers.formatUnits(deployerBalance, 6)} mUSDT to deployer`);
  
  // Create .env.local file for frontend
  const envLocalPath = path.join(__dirname, "../frontend/.env.local");
  const envContent = `# Kodapay Local PVM Development - ${new Date().toISOString()}

# Local Hardhat Development Node
NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8545
NEXT_PUBLIC_CHAIN_ID=31337
NEXT_PUBLIC_NETWORK_NAME=Local Hardhat

# Deployed Contract Addresses
NEXT_PUBLIC_KODAPAY_ADDRESS=${kodapayAddress}
NEXT_PUBLIC_USDT_ADDRESS=${mockUSDTAddress}

# Development Settings
NEXT_PUBLIC_ENVIRONMENT=development
NEXT_PUBLIC_DEBUG=true

# Block Explorer (local development)
NEXT_PUBLIC_BLOCK_EXPLORER_URL=http://localhost:8545
`;
  
  fs.writeFileSync(envLocalPath, envContent);
  console.log("📋 .env.local file created for frontend");
  
  // Save deployment info
  const deploymentInfo = {
    network: "local-pvm",
    chainId: 31337,
    timestamp: new Date().toISOString(),
    deployer: deployer.address,
    contracts: {
      mockUSDT: {
        address: mockUSDTAddress,
        mintedAmount: hre.ethers.formatUnits(deployerBalance, 6)
      },
      kodapay: {
        address: kodapayAddress
      }
    }
  };
  
  const deploymentPath = path.join(__dirname, "../deployments-local.json");
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  
  console.log("\n🎉 LOCAL PVM DEPLOYMENT COMPLETED!");
  console.log("=" .repeat(50));
  console.log(`📡 Network: Local PVM Development`);
  console.log(`🔑 Deployer: ${deployer.address}`);
  console.log(`💰 MockUSDT: ${mockUSDTAddress}`);
  console.log(`🚀 Kodapay: ${kodapayAddress}`);
  console.log("=" .repeat(50));
  
  console.log("\n🔧 NEXT STEPS:");
  console.log("1. 🌐 Start frontend: cd frontend && npm run dev");
  console.log("2. 🧪 Open http://localhost:3000");
  console.log("3. 🔗 Connect wallet to Local PVM (Chain ID: 31337)");
  console.log("4. 💡 Test unlimited mUSDT faucet functionality");
  console.log("5. 📊 Create subscriptions and test payroll system");
  
  console.log("\n💡 LOCAL PVM ADVANTAGES:");
  console.log("- ✅ Unlimited test tokens (no faucet dependency)");
  console.log("- ✅ Fast block times (~2 seconds)");
  console.log("- ✅ No network congestion");
  console.log("- ✅ Perfect for development and demos");
  console.log("- ✅ Full Pallet Revive compatibility");
}

main()
  .then(() => {
    console.log("\n✅ Local PVM deployment completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Local deployment failed:");
    console.error(error);
    process.exit(1);
  });
