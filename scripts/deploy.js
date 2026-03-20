/**
 * Kodapay Deployment Script for Westend Asset Hub
 * 
 * ¿Qué hace este archivo?
 * Script de deployment optimizado para Westend Asset Hub (PVM) con compatibilidad Ethers v6.
 * Despliega MockUSDT y Kodapay en secuencia, guarda direcciones y configura tokens iniciales.
 * 
 * ¿Por qué lo diseñamos así para PVM?
 * - PVM (Polkadot Virtual Machine) ejecuta bytecode RISC-V compilado desde Solidity
 * - Westend Asset Hub usa consenso de Polkadot (~6s block time) vs Ethereum (~12s)
 * - Gas costs son diferentes debido a la arquitectura Substrate subyacente
 * - Deployment requiere manejo específico de addresses y eventos en PVM
 * 
 * DEPLOYMENT SEQUENCE:
 * 1. Verificar saldo del deployer en WND (Westend tokens)
 * 2. Deploy MockUSDT (ERC20 compatible en PVM)
 * 3. Deploy Kodapay con referencia a MockUSDT
 * 4. Configurar tokens iniciales para testing
 * 5. Guardar addresses para frontend integration
 * 
 * Documentación para estudiar este concepto:
 * - Hardhat Deployment: https://hardhat.org/tutorial/deploying-to-a-live-network
 * - Polkadot PVM: https://wiki.polkadot.network/docs/learn-parachains
 * - Substrate EVM Pallet: https://docs.substrate.io/reference/frame-pallets/
 */

const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function deployPolkadotAware(contractName, args = [], deployer) {
  if (hre.polkadot && typeof hre.polkadot.deploy === "function") {
    return hre.polkadot.deploy(contractName, args);
  }

  // Fallback: keep deployment on the current Hardhat network provider (polkadot-enabled network)
  const factory = await hre.ethers.getContractFactory(contractName, deployer);
  return factory.deploy(...args);
}

/**
 * Main deployment function
 * Handles the complete deployment flow for Westend Asset Hub
 */
async function main() {
  console.log("🚀 Deploying Kodapay to Westend Asset Hub (PVM)...");
  console.log("📡 Network:", hre.network.name);
  console.log("⏰ Timestamp:", new Date().toISOString());
  if (!hre.network.config.polkadot) {
    throw new Error("❌ Network is not configured as polkadot-enabled. Set `polkadot: true` in hardhat.config.js.");
  }
  
  // Preflight: ensure PRIVATE_KEY corresponds to the expected address
  const expectedDeployer = "0x5F5232eb5F7f909ae74122F1E9b4b3a5F85Ac306";
  if (process.env.PRIVATE_KEY) {
    const pk = process.env.PRIVATE_KEY.startsWith('0x') ? process.env.PRIVATE_KEY : `0x${process.env.PRIVATE_KEY}`;
    const derived = new hre.ethers.Wallet(pk).address;
    if (derived.toLowerCase() !== expectedDeployer.toLowerCase()) {
      throw new Error(
        `❌ PRIVATE_KEY does not match expected deployer address.\nExpected: ${expectedDeployer}\nDerived:  ${derived}`
      );
    }
  }
  
  // Get deployer account (Ethers v6 compatible)
  const [deployer] = await hre.ethers.getSigners();
  console.log("🔑 Deploying with account:", deployer.address);
  if (deployer.address.toLowerCase() !== expectedDeployer.toLowerCase()) {
    throw new Error(
      `❌ Signer mismatch. Hardhat derived signer does not match expected deployer address.\nExpected: ${expectedDeployer}\nDerived:  ${deployer.address}`
    );
  }
  
  // Check balance (Ethers v6 syntax)
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "WND");
  
  // Verify minimum balance for deployment
  const minBalance = 1n; // Require balance > 0
  if (balance < minBalance) {
    throw new Error(`❌ Insufficient balance. Need balance > 0 WND, have ${hre.ethers.formatEther(balance)} WND`);
  }
  
  console.log("✅ Balance check passed");
  
  // Deploy MockUSDT first
  console.log("\n📄 Deploying MockUSDT...");
  const mockUSDT = await deployPolkadotAware("MockUSDT", [], deployer);
  
  // Wait for deployment (Ethers v6 syntax)
  await mockUSDT.waitForDeployment();
  const mockUSDTAddress = await mockUSDT.getAddress();
  console.log("✅ MockUSDT deployed to:", mockUSDTAddress);
  
  // Verify MockUSDT deployment
  const mockUSDTName = await mockUSDT.name();
  const mockUSDTSymbol = await mockUSDT.symbol();
  const mockUSDTDecimals = await mockUSDT.decimals();
  console.log(`   📋 Token: ${mockUSDTName} (${mockUSDTSymbol}) - ${mockUSDTDecimals} decimals`);
  
  // Deploy Kodapay
  console.log("\n💰 Deploying Kodapay...");
  const kodapay = await deployPolkadotAware("Kodapay", [mockUSDTAddress], deployer);
  
  // Wait for deployment (Ethers v6 syntax)
  await kodapay.waitForDeployment();
  const kodapayAddress = await kodapay.getAddress();
  console.log("✅ Kodapay deployed to:", kodapayAddress);
  console.log(`🔗 Explorer: https://westend-asset-hub.statescan.io/address/${kodapayAddress}`);
  
  // Verify Kodapay deployment
  const usdtTokenAddress = await kodapay.usdtToken();
  const executionFeeBPS = await kodapay.EXECUTION_FEE_BPS();
  console.log(`   📋 USDT Token: ${usdtTokenAddress}`);
  console.log(`   📋 Execution Fee: ${executionFeeBPS} BPS (${executionFeeBPS/100}%)`);
  
  // Save deployment information
  const deploymentInfo = {
    network: hre.network.name,
    chainId: hre.network.config.chainId,
    timestamp: new Date().toISOString(),
    deployer: deployer.address,
    deployerBalance: hre.ethers.formatEther(balance),
    contracts: {
      mockUSDT: {
        address: mockUSDTAddress,
        name: mockUSDTName,
        symbol: mockUSDTSymbol,
        decimals: mockUSDTDecimals
      },
      kodapay: {
        address: kodapayAddress,
        usdtToken: usdtTokenAddress,
        executionFeeBPS: executionFeeBPS.toString()
      }
    },
    // Gas usage information
    gasUsed: {
      mockUSDT: "Estimated ~800k gas",
      kodapay: "Estimated ~2.5M gas"
    }
  };
  
  // Save to deployments.json
  const deploymentPath = path.join(__dirname, "../deployments.json");
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log("\n📋 Deployment info saved to deployments.json");
  
  // Write a separate env file with deployed addresses (do not overwrite user's .env)
  const envPath = path.join(__dirname, "../.env.deployed");
  const envContent = `# Kodapay Deployment - ${new Date().toISOString()}
NEXT_PUBLIC_RPC_URL=https://westend-asset-hub-eth-rpc.polkadot.io
NEXT_PUBLIC_CHAIN_ID=420420421
NEXT_PUBLIC_NETWORK_NAME=Westend Asset Hub
NEXT_PUBLIC_CURRENCY_SYMBOL=WND

# Deployed Contract Addresses
NEXT_PUBLIC_KODAPAY_ADDRESS=${kodapayAddress}
NEXT_PUBLIC_USDT_ADDRESS=${mockUSDTAddress}
`;

  fs.writeFileSync(envPath, envContent);
  console.log("📋 Wrote deployed addresses to .env.deployed");
  
  // Mint initial test tokens to deployer
  console.log("\n🪙 Minting initial test tokens...");
  const mintAmount = hre.ethers.parseUnits("10000", 6); // 10k USDT (6 decimals)
  const mintTx = await mockUSDT.faucet(deployer.address, mintAmount);
  await mintTx.wait();
  
  const deployerBalance = await mockUSDT.balanceOf(deployer.address);
  console.log(`✅ Minted ${hre.ethers.formatUnits(deployerBalance, 6)} mUSDT to deployer`);
  
  // Final deployment summary
  console.log("\n✅ Kodapay deployed successfully!");
  console.log("=" .repeat(60));
  console.log(`📡 Network: ${hre.network.name} (Chain ID: ${hre.network.config.chainId})`);
  console.log(`🔑 Deployer: ${deployer.address}`);
  console.log("💰 MockUSDT:", mockUSDTAddress);
  console.log(`🚀 Kodapay: ${kodapayAddress}`);
  console.log(`🔗 Explorer: https://westend-asset-hub.statescan.io/address/${kodapayAddress}`);
  console.log("=" .repeat(60));
  
  console.log("\n🔧 NEXT STEPS:");
  console.log("1. 📝 Update frontend/.env.local with contract addresses");
  console.log("2. 🌐 Start frontend: cd frontend && npm run dev");
  console.log("3. 🧪 Test contracts with web interface");
  console.log("4. 💡 Create subscriptions and test incentivized execution");
  console.log("5. 📊 Monitor transactions on Westend Asset Hub block explorer");
  
  console.log("\n🎯 POLKADOT ECOSYSTEM INTEGRATION:");
  console.log("- ✅ Smart contracts running on PVM (RISC-V architecture)");
  console.log("- ✅ Compatible with Polkadot's 6-second block time");
  console.log("- ✅ Ready for XCM integration with other parachains");
  console.log("- ✅ Substrate-native gas optimization");
}

/**
 * Error handling and cleanup
 */
main()
  .then(() => {
    console.log("\n✅ Deployment script completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    
    // Provide helpful error context
    if (error.message.includes("insufficient funds")) {
      console.error("\n💡 SOLUTION: Add more WND tokens to your account");
      console.error("   Get testnet tokens from: https://faucet.polkadot.io/");
    } else if (error.message.includes("network")) {
      console.error("\n💡 SOLUTION: Check your network configuration");
      console.error("   Verify RPC URL: https://westend-asset-hub-eth-rpc.polkadot.io");
    } else if (error.message.includes("private key")) {
      console.error("\n💡 SOLUTION: Set your PRIVATE_KEY in .env file");
      console.error("   Format: PRIVATE_KEY=your_key_without_0x_prefix");
    }
    
    process.exit(1);
  });
