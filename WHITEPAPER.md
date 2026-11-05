# LastStand: Whitepaper & Project Architecture

**Subtitle:** Decentralized On-Chain Survival Gauntlet on Botchain  
**Tagline:** *One Life. One Chance. How Long Can You Survive?*  
**Version:** 1.0.0 (Mainnet Edition)  
**Date:** November 2026  
**Network:** Botchain Mainnet (Chain ID: `677`)  
**Contract Address:** `0x59fd31fA96fdEA0aeb85F5E541Ab47bB8f91012a`  
**Explorer:** [https://scan.botchain.ai](https://scan.botchain.ai)  

---

## Executive Summary

**LastStand** is an adrenaline-fueled, single-session Web3 survival mini-game built natively on **Botchain**. Designed with zero central server dependencies, LastStand brings classic "push-your-luck" tabletop and rogue-lite mechanics directly to Web3 gamers.

Players face a gauntlet of up to 10 lethal encounters. After every successful survival test, players face the ultimate dilemma: **Continue** into escalating danger to maximize their standing, or **Evacuate** to permanently lock in their survival score on the Botchain blockchain.

With immediate wallet-based onboarding, lightweight gas architecture, and a completely immutable smart contract backbone, LastStand serves as both an addictive community game and a premier stress-test showcase for Botchain's execution throughput and micro-transaction speeds.

---

## 1. The Problem & Market Opportunity

### Current Web3 Gaming Friction
1. **Over-Engineering & High Barriers:** Most Web3 games require large client downloads, account registrations, credit cards, or complex multi-step asset bridging before a player can experience 10 seconds of gameplay.
2. **Server Dependency masquerading as "Decentralized":** Many games advertise as Web3 but rely on centralized AWS/GCP servers for game logic, leaderboards, and user state. When the server goes down, the game disappears.
3. **Ecosystem Token Velocity Lack:** Emerging Layer 1 and Layer 2 mainnets often struggle to provide organic, high-frequency interactive dApps that engage users in repetitive on-chain interactions.

### The LastStand Solution
* **Zero Client Install & Zero Backend:** Pure browser execution utilizing Next.js, Wagmi v2, and direct Solidity smart contract interactions.
* **Instant Gratification:** Jump in, connect wallet, and play a full 10-round survival run in under 3 minutes.
* **On-Chain Permanence:** Scores, fatalities, and evacuations are permanently inscribed on Botchain, providing verifiable social bragging rights and potential future retroactive incentives.

---

## 2. Gameplay & Mathematical Mechanics

### Run Structure
* **Run Length:** Maximum 10 rounds per run.
* **Initial State:** Round 1, 0 Points.
* **Player Life:** 1 Life (Strict Permadeath per run).

### Risk Engine & Probability Tiers
Challenges are generated cryptographically in-browser utilizing standard high-entropy entropy pools (`crypto.getRandomValues()`).

| Danger Level | Indicator | Fatal Probability | Survival Rate | Strategic Context |
|---|:---:|:---:|:---:|---|
| **SAFE** | 🟢 | **5%** | 95% | Early round warm-up; minimal risk |
| **DANGER** | 🟡 | **25%** | 75% | Mid-game tactical dilemma; compounding risk |
| **CRITICAL** | 🔴 | **50%** | 50% | High-stakes late game; coin-flip for glory |

### Player Decision Matrix
At the conclusion of each survived round:
1. **CONTINUE (Press Your Luck):**
   * Attempt the next hazard.
   * If survived: Earn **+1 Survival Point** and advance to the next round.
   * If fatal: The run ends immediately in a fatality (**Score = Survived Rounds**).
2. **EVACUATE (Bank & Mint):**
   * Player voluntarily withdraws from the gauntlet.
   * Current score is safely secured.
   * Prompted to permanently stamp their verified survival run on Botchain Mainnet.

### Ultimate Victory
Surviving all 10 encounters completes the gauntlet, awarding **Ultimate Victory (10/10 points)** and unlocking maximum on-chain prestige.

---

## 3. Technical Architecture

### System Architecture Overview
```
┌────────────────────────────────────────────────────────┐
│                   Client Layer                         │
│  Next.js 14 (App Router) + TypeScript + Tailwind CSS   │
│  - CSP-compliant Web Crypto Engine                    │
│  - Wagmi v2 / Viem EIP-1193 Wallet Connector           │
└───────────────────────────┬────────────────────────────┘
                            │ (JSON-RPC / Web3 Calls)
                            ▼
┌────────────────────────────────────────────────────────┐
│                   Botchain Mainnet                     │
│  RPC: https://rpc.botchain.ai (Chain ID: 677)          │
│  Contract: 0x59fd31fA96fdEA0aeb85F5E541Ab47bB8f91012a │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────┴────────────────────────────┐
│               LastStand.sol (Smart Contract)           │
│  - Immutable Run Inscription (recordRun)               │
│  - Total Global Runs Counter                           │
│  - Per-Player Run Indexing & History Retrieval        │
└────────────────────────────────────────────────────────┘
```

### Smart Contract Specification (`LastStand.sol`)
The contract is written in Solidity `^0.8.20` and deployed on Botchain Mainnet:

* **Gas Optimized:** Minimal storage slots used per run.
* **Strict Parameter Bounds:** 
  * `score <= MAX_ROUNDS (10)`
  * `roundsCompleted <= MAX_ROUNDS (10)`
  * `score <= roundsCompleted`
* **Core Functions:**
  * `recordRun(uint8 score, uint8 roundsCompleted)`: Logs the outcome and emits `RunRecorded`.
  * `getTotalRuns()`: Global counter of all plays across the ecosystem.
  * `getRun(uint256 runId)`: Public run verification.
  * `getPlayerRuns(address player)`: Complete historical dossier for any connected wallet.

---

## 4. Ecosystem & Co-Marketing Value for Botchain

LastStand delivers immediate measurable value to the Botchain ecosystem:

1. **Transaction Velocity & Gas Burn:** Each run incentivizes an on-chain commit, driving real contract execution volume.
2. **Streamlined User Onboarding:** Serves as a perfect "First dApp" showcase for users transacting on Botchain.
3. **Cross-Community Engagement:** Provides an interactive medium for community competitions, leaderboard quests, and ecosystem reward distributions.

---

## 5. Roadmap

### Phase 1: Mainnet Launch (Current)
- [x] Solidity Smart Contract deployment on Botchain Mainnet.
- [x] Interactive web interface with audio-visual cues and responsive UX.
- [x] On-chain record stamping & history tracking.

### Phase 2: Provable Fairness & VRF Integration
- [ ] On-chain commit-reveal randomness or Chainlink / native Botchain VRF integration.
- [ ] Gasless Meta-Transactions (EIP-712 / ERC-4337 Account Abstraction) for zero-friction trial runs.

### Phase 3: Competitive & Tokenomics Layer
- [ ] Native Token Prize Pools: Entry stake model where top survivors split weekly jackpot pools.
- [ ] Commemorative Survival Badges (Dynamic Soulbound NFTs / ERC-721).
- [ ] Global Real-Time Leaderboard.

---

## 6. Project & Team Contacts

* **Project:** LastStand
* **Website / App:** [Deployed Locally / Vercel]
* **Repository:** [https://github.com/](https://github.com/)
* **Contract Address:** `0x59fd31fA96fdEA0aeb85F5E541Ab47bB8f91012a` (Botchain Mainnet)

