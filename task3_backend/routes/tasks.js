const express = require("express");
const router = express.Router();
const { ethers } = require("ethers");
const contractABI = require("../abi/TaskManager.json");

// Setup provider and signer
const provider = new ethers.providers.JsonRpcProvider(`https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractABI.abi, wallet);

// GET all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await contract.getAllTasks();
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching tasks");
  }
});

// POST add new task
router.post("/", async (req, res) => {
  const { title, description } = req.body;
  try {
    const tx = await contract.addTask(title, description);
    await tx.wait();
    res.status(201).send("Task added");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding task");
  }
});

// PUT update task (mark completed)
router.put("/:id/complete", async (req, res) => {
  const taskId = req.params.id;
  try {
    const tx = await contract.markTaskCompleted(taskId);
    await tx.wait();
    res.send("Task marked as completed");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error marking task completed");
  }
});

// DELETE task
router.delete("/:id", async (req, res) => {
  const taskId = req.params.id;
  try {
    const tx = await contract.deleteTask(taskId);
    await tx.wait();
    res.send("Task deleted");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting task");
  }
});

module.exports = router;
