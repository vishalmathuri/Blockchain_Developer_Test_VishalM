let provider, signer, contract;
const contractAddress = "0x34Cae817954a7A3423552E95E368B59737e1710b"; // Replace with your deployed contract address
let contractABI = null;

// Load contract ABI from JSON
async function loadContract() {
    const response = await fetch("./contract/TaskManager.json");
    const json = await response.json();
    contractABI = json.abi;
}

async function connectWallet() {
    if (window.ethereum) {
        provider = new ethers.providers.Web3Provider(window.ethereum, "sepolia");
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();

        // Fix ENS error: fetch address directly
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        const userAddress = accounts[0];
        document.getElementById("walletAddress").innerText = `Connected: ${userAddress}`;

        document.getElementById("connectWalletButton").style.display = "none";
        document.getElementById("taskManager").style.display = "block";

        if (!contractABI) await loadContract();
        contract = new ethers.Contract(contractAddress, contractABI, signer);
    } else {
        alert("MetaMask not detected.");
    }
}

async function addTask() {
    const title = document.getElementById("taskInput").value.trim();
    const desc = document.getElementById("taskDescription").value.trim();
    if (!title || !desc) return alert("Please fill in title and description");

    try {
        const tx = await contract.addTask(title, desc);
        await tx.wait();
        await fetchTasks();
    } catch (err) {
        console.error("Add Task Error:", err);
        alert("Transaction failed.");
    }
}

async function fetchTasks() {
    try {
        const tasks = await contract.getAllTasks();
        const list = document.getElementById("taskList");
        list.innerHTML = "";

        tasks.forEach(task => {
            const taskId = task.id.toString();
            const status = task.completed ? "✅ Completed" : "⏳ Pending";
            const item = document.createElement("li");

            item.innerHTML = `
                <div class="task-header">Task ID: ${taskId}</div>
                <p><strong>Title:</strong> ${task.title}</p>
                <p><strong>Description:</strong> ${task.description}</p>
                <p><strong>Status:</strong> ${status}</p>
                <p><strong>Owner:</strong> ${task.creator}</p>
                <button onclick="completeTask(${taskId})">Mark as Complete</button>
                <button onclick="editTask(${taskId})">Edit</button>
                <button onclick="deleteTask(${taskId})">Delete</button>
            `;

            list.appendChild(item);
        });
    } catch (err) {
        console.error("Fetch Task Error:", err);
    }
}

async function completeTask(taskId) {
    try {
        const tx = await contract.markTaskCompleted(taskId);
        await tx.wait();
        await fetchTasks();
    } catch (err) {
        console.error("Complete Task Error:", err);
        alert("Not authorized or failed.");
    }
}

async function editTask(taskId) {
    const newTitle = prompt("New title:");
    const newDesc = prompt("New description:");
    if (newTitle && newDesc) {
        try {
            const tx = await contract.editTask(taskId, newTitle, newDesc);
            await tx.wait();
            await fetchTasks();
        } catch (err) {
            console.error("Edit Task Error:", err);
            alert("Edit failed.");
        }
    }
}

async function deleteTask(taskId) {
    if (confirm("Are you sure to delete this task?")) {
        try {
            const tx = await contract.deleteTask(taskId);
            await tx.wait();
            await fetchTasks();
        } catch (err) {
            console.error("Delete Task Error:", err);
            alert("Delete failed.");
        }
    }
}
