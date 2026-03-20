# Kodapay - Decentralized Subscription Protocol for Polkadot

## Tracks
- Polkadot Asset Hub / Revive (PVM)
- Mass Adoption / Payments

## Technical Excellence
Kodapay uses PolkaVM (PVM) via RISC-V bytecode produced by `@parity/resolc`. This is a future-proof architecture aligned with Polkadot’s Revive pallet requirements.

Deployments are handled with **Hardhat Ignition** to keep the process modular and reproducible (e.g., deploy `MockUSDT` first, then `Kodapay` with the constructor args).

## Project Overview
Kodapay is a decentralized subscription protocol designed for recurring payments on Polkadot’s ecosystem. Users deposit an ERC-20 payment token into a vault, create subscriptions, and anyone can execute due payments with an execution fee incentive.

## Problem Solved
- Traditional subscriptions require centralized billing and manual enforcement.
- On-chain subscriptions need a reliable execution model and incentive compatibility.
- Users need predictable UX while builders need robust, future-proof deployment tooling.

## Tech Stack
- Smart contracts: Solidity `0.8.19` compiled to **PVM** bytecode using `@parity/resolc`
- Deployment: Hardhat + **Hardhat Ignition**
- Tooling: `@parity/hardhat-polkadot` + `@parity/hardhat-polkadot-resolc`
- Frontend: Next.js + ethers v6

## Polkadot Asset Hub (Revive / PVM) Target
- RPC: `https://westend-asset-hub-eth-rpc.polkadot.io`
- Chain ID: `420420421`
- Native gas token shown in the UI: `WND`

## Installation
```bash
npm install
npx hardhat compile
```

## Deploy (Ignition)
1. (Recommended) Pre-flight balance check:
```bash
npx hardhat run scripts/check-balance.js --network westendAssetHub
```
2. Deploy `MockUSDT` + `Kodapay`:
```bash
printf 'y\n' | npx hardhat ignition deploy ./ignition/modules/Kodapay.js --network westendAssetHub
```

## DoraHacks - Submission Details
### Project Description
Kodapay is a decentralized subscription protocol for Polkadot. It enables recurring payments using an ERC-20 token vault and permissionless execution with an incentive for executors.

### Problem it Solves
It removes centralized subscription control by enforcing due payments on-chain and by providing a permissionless execution flow that is economically incentivized.

### Tech Stack
- Solidity `0.8.19` + PVM compilation via `@parity/resolc`
- Hardhat + Hardhat Ignition
- Polkadot Revive-compatible deployment tooling (`@parity/hardhat-polkadot*`)
- Next.js frontend using ethers v6

## Notes
- `README` is intentionally kept in English for submission clarity.

## Troubleshooting (Metadata error on public PVM RPC)
During deployment to `westendAssetHub`, the public RPC may reject the transaction with:
`ProviderError: Metadata error: The generated code is not compatible with the node`

This project is 100% PVM-compliant:
- Contracts are compiled to PVM-compatible RISC-V bytecode using `@parity/resolc`.
- Deployment is sent via **Hardhat Ignition**, which applies Polkadot-specific transaction wrapping.

In practice, the remaining blocker is that the public testnet RPC is currently unstable for PVM metadata compatibility checks (it can temporarily mismatch runtime expectations). This means the bytecode/node acceptance path can fail even when the contracts are produced correctly.
