// scripts/deploy_optimized.js
const hre = require("hardhat");

async function main() {
  const TaskManagerOptimized = await hre.ethers.getContractFactory("TaskManagerOptimized");
  const taskManager = await TaskManagerOptimized.deploy();

  await taskManager.deployed();
  console.log("TaskManagerOptimized deployed to:", taskManager.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
