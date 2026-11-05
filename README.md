# LastStand

> **Tagline:** *One Life. One Chance. How Long Can You Survive?*

LastStand is a Web3 survival mini-game built on **Botchain Mainnet**. Players navigate a series of up to 10 lethal encounters, choose each round whether to press forward or evacuate, and permanently record their survival records on-chain.

The entire application runs on **one page**, connects to **one Solidity smart contract**, and requires **no centralized database or backend**.

---

## 1. Network Configuration: Botchain Mainnet

| Setting | Value |
|---|---|
| **Network Name** | Botchain Mainnet |
| **Chain ID** | `677` |
| **RPC Endpoint** | `https://rpc.botchain.ai` |
| **Block Explorer** | `https://scan.botchain.ai` |
| **Currency Symbol** | `BOT` |
| **Total Supply** | 150 Million |
| **Deployed Contract** | `0x59fd31fA96fdEA0aeb85F5E541Ab47bB8f91012a` |

---

## 2. Gameplay Mechanics

- **Maximum Rounds:** 10 rounds per run.
- **Starting State:** Every run starts at Round 1 with 0 points.
- **Cryptographic Fairness:** Challenges are generated using `crypto.getRandomValues()` (never `Math.random()`).
- **Danger Levels & Fatal Probabilities:**
  - 🟢 **SAFE:** 5% fatal probability (95% survival rate)
  - 🟡 **DANGER:** 25% fatal probability (75% survival rate)
  - 🔴 **CRITICAL:** 50% fatal probability (50% survival rate)
- **Player Decisions:**
  - **CONTINUE:** Face the encounter. If survived, earn +1 point and advance. If fatal, the run terminates immediately.
  - **END RUN:** Voluntarily evacuate to bank your current score and lock in your survival record.
- **Victory:** Complete all 10 rounds to achieve **Ultimate Victory**.
- **On-Chain Recording:** Completed runs (both fatalities and voluntary evacuations) can be stamped to the smart contract on Botchain Mainnet.

---

## 3. Technology Stack

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS
- **Web3 Integration:** wagmi v2, viem, TanStack Query
- **Wallet Support:** MetaMask & Injected EIP-1193 Web3 Wallets
- **Smart Contract & Dev Environment:** Solidity `^0.8.20`, Hardhat

---

## 4. Smart Contract Architecture

The contract [`LastStand.sol`](./contracts/LastStand.sol) manages on-chain run records:

- `recordRun(uint8 score, uint8 roundsCompleted)`: Records a completed survival run for `msg.sender`. Validates that `score <= 10`, `roundsCompleted <= 10`, and `score <= roundsCompleted`. Emits `RunRecorded`.
- `getTotalRuns()`: Returns total number of survival runs recorded globally.
- `getRun(uint256 runId)`: Returns full record of any run by its unique ID.
- `getPlayerRunCount(address playerAddress)`: Returns number of runs recorded by a specific wallet.
- `getPlayerRun(address playerAddress, uint256 index)`: Returns a player's run by index.

---

## 5. Getting Started & Local Development

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Compile the Smart Contract
```bash
npx hardhat compile
```

### Step 3: Run the Hardhat Test Suite
```bash
npx hardhat test
```

### Step 4: Deploy to Botchain Mainnet
1. Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```
2. Add your deployment private key funded with `BOT` tokens:
```env
PRIVATE_KEY=your_private_key_here
```
3. Run the deployment script:
```bash
npm run deploy:mainnet
```
The script will output your deployed contract address and automatically save it to `lib/contract/deployed-address.json`.

### Step 5: Run the Frontend Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 6. Deploying the Frontend to Vercel

1. Push this repository to GitHub or GitLab.
2. Import the project into [Vercel](https://vercel.com).
3. Set the Environment Variable:
   - `NEXT_PUBLIC_LASTSTAND_CONTRACT_ADDRESS`: `0x59fd31fA96fdEA0aeb85F5E541Ab47bB8f91012a`
4. Deploy! Next.js will build and serve the single-page application.

---

## 7. License

MIT
