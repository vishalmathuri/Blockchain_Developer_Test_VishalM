const hre = require("hardhat");

async function main() {
  console.log("Deploying TaskManager...");

  const TaskManager = await hre.ethers.getContractFactory("TaskManager");
  const taskManager = await TaskManager.deploy();

  await taskManager.waitForDeployment(); // ✅ Use this instead of .deployed()

  const address = await taskManager.getAddress(); // ✅ Use this instead of .address
  console.log(`✅ TaskManager deployed to: ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

