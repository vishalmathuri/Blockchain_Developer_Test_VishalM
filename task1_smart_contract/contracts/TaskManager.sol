// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TaskManager {
    struct Task {
        uint256 id;
        string title;
        string description;
        bool completed;
        address owner;
    }

    uint256 private taskCounter;
    mapping(uint256 => Task) private tasks;

    event TaskAdded(uint256 indexed taskId, string title, string description, address owner);
    event TaskCompleted(uint256 indexed taskId);
    event TaskEdited(uint256 indexed taskId, string newTitle, string newDescription);
    event TaskDeleted(uint256 indexed taskId);

    modifier onlyOwner(uint256 _taskId) {
        require(tasks[_taskId].owner == msg.sender, "Not the task owner");
        _;
    }

    function addTask(string memory _title, string memory _description) external {
        uint256 taskId = taskCounter++;
        tasks[taskId] = Task(taskId, _title, _description, false, msg.sender);
        emit TaskAdded(taskId, _title, _description, msg.sender);
    }

    function markTaskCompleted(uint256 _taskId) external onlyOwner(_taskId) {
        tasks[_taskId].completed = true;
        emit TaskCompleted(_taskId);
    }

    function editTask(uint256 _taskId, string memory _newTitle, string memory _newDescription) external onlyOwner(_taskId) {
        tasks[_taskId].title = _newTitle;
        tasks[_taskId].description = _newDescription;
        emit TaskEdited(_taskId, _newTitle, _newDescription);
    }

    function deleteTask(uint256 _taskId) external onlyOwner(_taskId) {
        delete tasks[_taskId];
        emit TaskDeleted(_taskId);
    }

    function getTask(uint256 _taskId) external view returns (Task memory) {
        require(tasks[_taskId].owner != address(0), "Task does not exist");
        return tasks[_taskId];
    }

    function getAllTasks() external view returns (Task[] memory) {
        uint256 count;
        for (uint256 i = 0; i < taskCounter; i++) {
            if (tasks[i].owner != address(0)) {
                count++;
            }
        }

        Task[] memory taskList = new Task[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < taskCounter; i++) {
            if (tasks[i].owner != address(0)) {
                taskList[index] = tasks[i];
                index++;
            }
        }

        return taskList;
    }
}
