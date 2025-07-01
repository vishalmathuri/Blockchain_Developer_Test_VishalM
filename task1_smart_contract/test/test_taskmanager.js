const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TaskManager", function () {
  let TaskManager, taskManager, owner, user;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();
    TaskManager = await ethers.getContractFactory("TaskManager");
    taskManager = await TaskManager.deploy();
    await taskManager.waitForDeployment();
  });

  it("should allow a user to create a task", async function () {
    await taskManager.connect(owner).addTask("Test Task", "Test Description");

    const task = await taskManager.getTask(0);
    expect(task.title).to.equal("Test Task");
    expect(task.description).to.equal("Test Description");
    expect(task.completed).to.equal(false);
    expect(task.owner).to.equal(owner.address);
  });

  it("should allow only the owner to mark task as completed", async function () {
    await taskManager.connect(owner).addTask("Task 1", "Desc");
    await taskManager.connect(owner).markTaskCompleted(0);

    const task = await taskManager.getTask(0);
    expect(task.completed).to.equal(true);
  });

  it("should not allow others to mark task as completed", async function () {
    await taskManager.connect(owner).addTask("Task 1", "Desc");
    await expect(taskManager.connect(user).markTaskCompleted(0)).to.be.revertedWith("Not the task owner");
  });

  it("should delete a task correctly", async function () {
    await taskManager.connect(owner).addTask("To Be Deleted", "Delete me");
    await taskManager.connect(owner).deleteTask(0);

    await expect(taskManager.getTask(0)).to.be.revertedWith("Task does not exist");
  });
});
