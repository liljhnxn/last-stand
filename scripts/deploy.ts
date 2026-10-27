import hre from "hardhat";
const { ethers } = hre;
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("=========================================");
  console.log("Deploying LastStand to Botchain Testnet...");
  console.log("=========================================");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "BOT");

  const LastStandFactory = await ethers.getContractFactory("LastStand");
  const lastStand = await LastStandFactory.deploy();

  await lastStand.waitForDeployment();
  const contractAddress = await lastStand.getAddress();

  console.log("-----------------------------------------");
  console.log("LastStand deployed successfully!");
  console.log("Contract Address:", contractAddress);
  console.log("Explorer URL: https://scan.bohr.life/address/" + contractAddress);
  console.log("-----------------------------------------");

  // Save the address and ABI to frontend config
  const frontendDir = path.join(process.cwd(), "lib/contract");
  if (!fs.existsSync(frontendDir)) {
    fs.mkdirSync(frontendDir, { recursive: true });
  }

  const deploymentInfo = {
    address: contractAddress,
    network: "Botchain Testnet",
    chainId: 968,
    rpcUrl: "https://rpc.bohr.life",
    explorerUrl: "https://scan.bohr.life",
    deployedAt: new Date().toISOString(),
  };

  fs.writeFileSync(
    path.join(frontendDir, "deployed-address.json"),
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("Saved deployment details to lib/contract/deployed-address.json");
  console.log("Remember: If you deploy a new contract, update lib/contract/deployed-address.json!");
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
