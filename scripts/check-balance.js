const hre = require("hardhat");

const EXPECTED_SIGNER_ADDRESS = "0x5F5232eb5F7f909ae74122F1E9b4b3a5F85Ac306";

async function main() {
  console.log("🔎 Kodapay Pre-flight: Check WND balance on Westend Asset Hub");
  console.log("📡 Network:", hre.network.name);

 /*  if (hre.network.name !== "westendAssetHub") {
    throw new Error(
      `❌ Wrong network: ${hre.network.name}. Run with: npx hardhat run scripts/check-balance.js --network westendAssetHub`
    );
  } */

  const [signer] = await hre.ethers.getSigners();
  const signerAddress = signer.address;

  if (signerAddress.toLowerCase() !== EXPECTED_SIGNER_ADDRESS.toLowerCase()) {
    throw new Error(
      `❌ Signer mismatch. Your .env PRIVATE_KEY must correspond to the funded deployer address.\nExpected: ${EXPECTED_SIGNER_ADDRESS}\nDerived:  ${signerAddress}`
    );
  }

  const balance = await hre.ethers.provider.getBalance(signerAddress);
  const formatted = hre.ethers.formatEther(balance);

  console.log(`👤 Signer:  ${signerAddress}`);
  console.log(`💰 Balance: ${formatted} WND`);

  if (balance <= 0n) {
    throw new Error("❌ Balance is 0 WND. Fund this address before deploying.");
  }

  console.log("✅ Pre-flight passed: signer matches and balance > 0");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
