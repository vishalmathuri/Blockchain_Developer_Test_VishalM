## 🧾 Task 1: Smart Contract - Task Management System

### ✅ Contract Name

**`TaskManager.sol`**

---

### 🔍 Contract Logic Overview

The `TaskManager` smart contract is a decentralized task management system built with Solidity. It allows users to create, manage, and view tasks securely on-chain.

#### 📦 Features:

* **Task Creation:** Any user can create a task with a title and description.
* **Task Structure:** Each task contains:

  * `id`: Unique task identifier.
  * `title`: Task title.
  * `description`: Task description.
  * `completed`: Completion status (`true` or `false`).
  * `owner`: Address of the task creator.
* **Access Control:** Only the **task creator (owner)** can:

  * Mark a task as completed.
  * Edit or delete their own task.
* **Public Viewing:** Any user can:

  * View a task by its ID.
  * List all existing tasks.
* **Events:** Emits events for task creation, updates, deletion, and completion for easy frontend integration.

---

### 🚀 Deployment Steps

#### 📁 Prerequisites:

1. Node.js ≥ 16.x
2. Hardhat:

   ```bash
   npm install --save-dev hardhat
   ```
3. Install dependencies:

   ```bash
   npm install @nomicfoundation/hardhat-toolbox dotenv
   ```

#### 🌐 Configure Sepolia Testnet:

Update your `hardhat.config.js`:

```js
require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
```

Add a `.env` file in the root:

```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=your_wallet_private_key
```

#### 📦 Compile Contract:

```bash
npx hardhat compile
```

#### 📤 Deploy Contract:

```bash
npx hardhat run deploy/deploy.js --network sepolia
```

---

### ✅ Deployment Output

Replace with your actual deployed contract info:

* **Contract Address:** `0x34Cae817954a7A3423552E95E368B59737e1710b`
* **Deployer Address:** `0x9CF372227cf27996B7BBC4dE0ed257DcA21d166e`
* **Network:** Sepolia Testnet

---

### 🧪 Running Tests

Run the test suite:

```bash
npx hardhat test
```

Test cases include:

* ✅ Task creation
* ✅ Marking task completed by owner
* ✅ Rejection for unauthorized access
* ✅ Deleting a task and verifying it

---

Let me know if you want me to auto-generate the full `README.md` with all tasks included.
