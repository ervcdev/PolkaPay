/**
 * Westend Asset Hub Deployment Script
 * Optimized specifically for Polkadot's Asset Hub testnet environment
 */

const hre = require("hardhat");

async function main() {
  console.log("🌐 Deploying to Westend Asset Hub...");
  
  // Verify we're on the correct network
  if (hre.network.name !== "westendAssetHub") {
    throw new Error("❌ This script is only for Westend Asset Hub network");
  }
  
  // Run the main deployment
  await hre.run("run", { script: "scripts/deploy.js" });
  
  console.log("\n🎯 Westend Asset Hub deployment completed!");
  console.log("🔗 Add testnet tokens: https://faucet.polkadot.io/");
  console.log("📊 Monitor transactions on Westend Asset Hub explorer");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
