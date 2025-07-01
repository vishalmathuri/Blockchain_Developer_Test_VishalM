const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TaskManagerOptimized", function () {
  let TaskManager;
  let taskManager;
  let owner;
  let addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    const TaskManagerFactory = await ethers.getContractFactory("TaskManagerOptimized");
    taskManager = await TaskManagerFactory.deploy();
    await taskManager.deployed();
  });

  it("should add a task", async function () {
    const tx = await taskManager.connect(addr1).addTask("Title", "Desc");
    await tx.wait();
    const tasks = await taskManager.getAllTasks();
    expect(tasks.length).to.equal(1);
    expect(tasks[0].title).to.equal("Title");
    expect(tasks[0].description).to.equal("Desc");
    expect(tasks[0].completed).to.equal(false);
  });

  it("should allow only owner to mark task complete", async function () {
    await taskManager.connect(addr1).addTask("T", "D");
    await expect(taskManager.connect(owner).markTaskCompleted(0)).to.be.reverted;
    await taskManager.connect(addr1).markTaskCompleted(0);
    const task = (await taskManager.getAllTasks())[0];
    expect(task.completed).to.be.true;
  });

  it("should delete a task", async function () {
    await taskManager.connect(addr1).addTask("T", "D");
    await taskManager.connect(addr1).deleteTask(0);
    const tasks = await taskManager.getAllTasks();
    expect(tasks.length).to.equal(0);
  });
});
