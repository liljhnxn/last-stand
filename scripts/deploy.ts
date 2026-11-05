import hre from "hardhat";
const { ethers } = hre;
import * as fs from "fs";
import * as path from "path";

async function main() {
  const network = await ethers.provider.getNetwork();
  const chainId = Number(network.chainId);

  console.log("=========================================");
  console.log(`Deploying LastStand to Botchain Mainnet (Chain ID: ${chainId})...`);
  console.log("=========================================");

  const [deployer] = await ethers.getSigners();
  console.log("Deployer address:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Deployer balance:", ethers.formatEther(balance), "BOT");

  // Fetch gas price / fee data to ensure minimal gas consumption
  const feeData = await ethers.provider.getFeeData();
  const gasPrice = feeData.gasPrice ?? ethers.parseUnits("20", "gwei");
  console.log("Current network gas price:", ethers.formatUnits(gasPrice, "gwei"), "gwei");

  const LastStandFactory = await ethers.getContractFactory("LastStand");

  // Estimate gas
  const deployTx = await LastStandFactory.getDeployTransaction();
  const estimatedGas = await ethers.provider.estimateGas(deployTx);
  const estimatedCost = estimatedGas * gasPrice;
  console.log("Estimated deployment gas:", estimatedGas.toString());
  console.log("Estimated cost in BOT:", ethers.formatEther(estimatedCost), "BOT");

  // Deploy with exact gasPrice
  console.log("Deploying contract...");
  const lastStand = await LastStandFactory.deploy({
    gasPrice: gasPrice,
  });

  await lastStand.waitForDeployment();
  const contractAddress = await lastStand.getAddress();

  const explorerBase = "https://scan.botchain.ai";
  const rpcUrl = "https://rpc.botchain.ai";

  console.log("-----------------------------------------");
  console.log("LastStand deployed successfully to Botchain Mainnet!");
  console.log("Contract Address:", contractAddress);
  console.log(`Explorer URL: ${explorerBase}/address/${contractAddress}`);
  console.log("-----------------------------------------");

  // Save the address and config to frontend
  const frontendDir = path.join(process.cwd(), "lib/contract");
  if (!fs.existsSync(frontendDir)) {
    fs.mkdirSync(frontendDir, { recursive: true });
  }

  const deploymentInfo = {
    address: contractAddress,
    network: "Botchain Mainnet",
    chainId: chainId,
    rpcUrl: rpcUrl,
    explorerUrl: explorerBase,
    deployedAt: new Date().toISOString(),
  };

  fs.writeFileSync(
    path.join(frontendDir, "deployed-address.json"),
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("Saved deployment details to lib/contract/deployed-address.json");

  // Update .env file if it exists
  const envPath = path.join(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    let envContent = fs.readFileSync(envPath, "utf8");
    if (envContent.includes("NEXT_PUBLIC_LASTSTAND_CONTRACT_ADDRESS=")) {
      envContent = envContent.replace(
        /NEXT_PUBLIC_LASTSTAND_CONTRACT_ADDRESS=.*/,
        `NEXT_PUBLIC_LASTSTAND_CONTRACT_ADDRESS=${contractAddress}`
      );
    } else {
      envContent += `\nNEXT_PUBLIC_LASTSTAND_CONTRACT_ADDRESS=${contractAddress}\n`;
    }
    fs.writeFileSync(envPath, envContent);
    console.log("Updated NEXT_PUBLIC_LASTSTAND_CONTRACT_ADDRESS in .env");
  }
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
