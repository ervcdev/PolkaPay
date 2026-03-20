const hre = require("hardhat");

async function main() {
  console.log("🔌 Kodapay RPC Debug: test connection");
  console.log("📡 Network:", hre.network.name);

  const net = await hre.ethers.provider.getNetwork();
  console.log("🆔 chainId:", net.chainId.toString());

  const blockNumber = await hre.ethers.provider.getBlockNumber();
  console.log("🧱 Latest block:", blockNumber);

  console.log("✅ RPC is alive");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ RPC test failed:");
    console.error(error);
    process.exit(1);
  });
