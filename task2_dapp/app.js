let provider, signer, contract;
const contractAddress = "0xA58eA87FD9eD0A85C6B283106E7Ce2a966CFdD11"; // replace this

let abi;

async function loadABI() {
    const res = await fetch("./contract/TaskManager.json");
    const json = await res.json();
    abi = json.abi;
}

async function connectWallet() {
    if (window.ethereum) {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
        await loadABI();
        contract = new ethers.Contract(contractAddress, abi, signer);

        document.getElementById("walletAddress").innerText = `Connected: ${await signer.getAddress()}`;
        document.getElementById("connectWalletButton").style.display = "none";
        document.getElementById("taskManager").style.display = "block";
    } else {
        alert("Please install MetaMask");
    }
}

document.getElementById("connectWalletButton").onclick = connectWallet;

document.getElementById("addTaskButton").onclick = async function () {
    const title = document.getElementById("taskInput").value;
    const desc = document.getElementById("taskDescription").value;
    if (title && desc) {
        const tx = await contract.addTask(title, desc);
        await tx.wait();
        fetchTasks();
    }
};

document.getElementById("fetchTasksButton").onclick = fetchTasks;

async function fetchTasks() {
    const tasks = await contract.getAllTasks();
    const list = document.getElementById("taskList");
    list.innerHTML = "";

    tasks.forEach((task) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <div class="task-header">Task ID: ${task.id}</div>
            <p><strong>Title:</strong> ${task.title}</p>
            <p><strong>Description:</strong> ${task.description}</p>
            <p><strong>Status:</strong> ${task.completed ? "✅ Completed" : "⏳ Pending"}</p>
            <p><strong>Owner:</strong> ${task.creator}</p>
        `;
        list.appendChild(li);
    });
}
