require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ignition-ethers");
require("@parity/hardhat-polkadot");
require("@parity/hardhat-polkadot-resolc");
require("dotenv").config();

module.exports = {
  solidity: "0.8.19",
  resolc: {
    version: "0.3.0",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      metadata: {
        appendCBOR: false,
      },
    },
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      accounts: process.env.PRIVATE_KEY
        ? [process.env.PRIVATE_KEY.startsWith("0x") ? process.env.PRIVATE_KEY : `0x${process.env.PRIVATE_KEY}`]
        : [],
      chainId: 420420421,
      polkadot: true,
    },
    westendAssetHub: {
      url: "https://westend-asset-hub-eth-rpc.polkadot.io",
      accounts: process.env.PRIVATE_KEY
        ? [process.env.PRIVATE_KEY.startsWith("0x") ? process.env.PRIVATE_KEY : `0x${process.env.PRIVATE_KEY}`]
        : [],
      chainId: 420420421,
      polkadot: true,
      gas: "auto",
      gasPrice: "auto",
      // Increase gas limit to reduce false-positive metadata errors due to estimation limits.
      blockGasLimit: 300000000,
    },
  },
};
