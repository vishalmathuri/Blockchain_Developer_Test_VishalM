// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TaskManagerOptimized {
    struct Task {
        uint256 id;
        string title;
        string description;
        bool completed;
        address creator;
    }

    uint256 private taskCounter;
    mapping(uint256 => Task) private tasks;
    mapping(address => uint256[]) private userTasks;

    event TaskCreated(uint256 indexed id, address indexed creator, string title);
    event TaskCompleted(uint256 indexed id);
    event TaskEdited(uint256 indexed id, string newTitle, string newDescription);
    event TaskDeleted(uint256 indexed id);

    modifier onlyOwner(uint256 _taskId) {
        require(tasks[_taskId].creator == msg.sender, "Not the task owner");
        _;
    }

    function addTask(string calldata _title, string calldata _description) external {
        uint256 id = taskCounter++;
        tasks[id] = Task(id, _title, _description, false, msg.sender);
        userTasks[msg.sender].push(id);
        emit TaskCreated(id, msg.sender, _title);
    }

    function markTaskCompleted(uint256 _taskId) external onlyOwner(_taskId) {
        tasks[_taskId].completed = true;
        emit TaskCompleted(_taskId);
    }

    function editTask(uint256 _taskId, string calldata _newTitle, string calldata _newDescription) external onlyOwner(_taskId) {
        Task storage task = tasks[_taskId];
        task.title = _newTitle;
        task.description = _newDescription;
        emit TaskEdited(_taskId, _newTitle, _newDescription);
    }

    function deleteTask(uint256 _taskId) external onlyOwner(_taskId) {
        delete tasks[_taskId];
        emit TaskDeleted(_taskId);
    }

    function getAllTasks() external view returns (Task[] memory) {
        uint256[] memory ids = userTasks[msg.sender];
        uint256 length = ids.length;

        uint256 count;
        for (uint256 i = 0; i < length; i++) {
            if (tasks[ids[i]].creator != address(0)) {
                count++;
            }
        }

        Task[] memory result = new Task[](count);
        uint256 index;

        for (uint256 i = 0; i < length; i++) {
            Task memory task = tasks[ids[i]];
            if (task.creator != address(0)) {
                result[index++] = task;
            }
        }

        return result;
    }
}
