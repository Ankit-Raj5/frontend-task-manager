import React, { useState, useEffect } from "react";
import { getTasks, createTask, updateTask, deleteTask } from "../services/api";
import dayjs from "dayjs";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", priority: "", status: "pending", startTime: "", endTime: "" });
  const [filters, setFilters] = useState({ priority: "", status: "", sort: "" });
  const [selectedTasks, setSelectedTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  const fetchTasks = async () => {
    try {
      const response = await getTasks();
      let filteredTasks = response.data?.tasks || [];

      // Apply Filters
      if (filters.priority) {
        filteredTasks = filteredTasks.filter((task) => task.priority === parseInt(filters.priority));
      }
      if (filters.status) {
        filteredTasks = filteredTasks.filter((task) => task.status.toLowerCase() === filters.status);
      }

      // Apply Sorting
      if (filters.sort) {
        const [key, order] = filters.sort.split("-");
        filteredTasks.sort((a, b) => {
          if (dayjs(a[key]).isBefore(dayjs(b[key]))) return order === "asc" ? -1 : 1;
          if (dayjs(a[key]).isAfter(dayjs(b[key]))) return order === "asc" ? 1 : -1;
          return 0;
        });
      }

      setTasks(filteredTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasks([]);
    }
  };

  const formatDateTime = (dateTime) => dayjs(dateTime).format("DD MMM YYYY hh:mm A");
  const calculateTotalTime = (start, end) => (dayjs(end).diff(dayjs(start), "hour", true) || "-");

  const handleInputChange = (e) => setNewTask({ ...newTask, [e.target.name]: e.target.value });

  const handleSaveTask = async () => {
    if (!newTask.title || !newTask.priority || !newTask.startTime) {
      alert("Please fill in all required fields.");
      return;
    }
    if (newTask.endTime && newTask.startTime && newTask.endTime < newTask.startTime) {
      alert("End time must be after start time.");
      return;
    }
    try {
      if (selectedTask) await updateTask(selectedTask._id, newTask);
      else await createTask(newTask);

      setShowModal(false);
      fetchTasks();
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setNewTask({
      title: task.title,
      priority: task.priority,
      status: task.status,
      startTime: task.startTime,
      endTime: task.endTime,
    });
    setShowModal(true);
  };

  const handleDeleteTask = async (id) => {
    await deleteTask(id);
    fetchTasks();
  };

  const handleDeleteSelected = async () => {
    for (const taskId of selectedTasks) {
      await deleteTask(taskId);
    }
    setSelectedTasks([]);
    fetchTasks();
  };

  const handleFilterChange = (key, value) => setFilters({ ...filters, [key]: value });

  const handleSelectTask = (id) => {
    if (selectedTasks.includes(id)) {
      setSelectedTasks(selectedTasks.filter((taskId) => taskId !== id));
    } else {
      setSelectedTasks([...selectedTasks, id]);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Task List</h1>
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setShowModal(true)} className="bg-blue-500 text-white px-4 py-2 rounded">
          + Add Task
        </button>
        <button
          onClick={handleDeleteSelected}
          disabled={selectedTasks.length === 0}
          className={`px-4 py-2 rounded ${selectedTasks.length ? "bg-red-500 text-white" : "bg-gray-300 text-gray-500"}`}
        >
          Delete Selected
        </button>
      </div>

      {/* Filters and Sorting */}
      <div className="flex gap-4 mb-4 justify-end">
        <select onChange={(e) => handleFilterChange("priority", e.target.value)} className="border p-2 rounded">
          <option value="">Priority</option>
          {[1, 2, 3, 4, 5].map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <select onChange={(e) => handleFilterChange("status", e.target.value)} className="border p-2 rounded">
          <option value="">Status</option>
          <option value="pending">Pending</option>
          <option value="finished">Finished</option>
        </select>
        <select onChange={(e) => handleFilterChange("sort", e.target.value)} className="border p-2 rounded">
          <option value="">Sort</option>
          <option value="startTime-asc">Start Time: ASC</option>
          <option value="startTime-desc">Start Time: DESC</option>
          <option value="endTime-asc">End Time: ASC</option>
          <option value="endTime-desc">End Time: DESC</option>
        </select>
      </div>

      {/* Task Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">
                <input type="checkbox" />
              </th>
              <th className="border p-2">Task ID</th>
              <th className="border p-2">Title</th>
              <th className="border p-2">Priority</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Start Time</th>
              <th className="border p-2">End Time</th>
              <th className="border p-2">Total Time (hrs)</th>
              <th className="border p-2">Edit</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id}>
                <td className="border p-2 text-center">
                  <input
                    type="checkbox"
                    checked={selectedTasks.includes(task._id)}
                    onChange={() => handleSelectTask(task._id)}
                  />
                </td>
                <td className="border p-2">{task._id}</td>
                <td className="border p-2">{task.title}</td>
                <td className="border p-2">{task.priority}</td>
                {/* <td className="border p-2">{task.status}</td> */}
                <td className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${task.status?.trim().toLowerCase() === 'pending' ? 'bg-red-100 text-red-600' : task.status?.trim().toLowerCase() === 'finished' ? 'bg-green-100 text-green-600' : ''}`}>
  {task.status}
</td>

                <td className="border p-2">{formatDateTime(task.startTime)}</td>
                <td className="border p-2">{formatDateTime(task.endTime)}</td>
                <td className="border p-2">{calculateTotalTime(task.startTime, task.endTime)}</td>
                <td className="border p-2">
                  <button className="text-blue-500" onClick={() => handleEditTask(task)}>
                    ✏️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">{selectedTask ? "Edit Task" : "Add Task"}</h2>
            <input type="text" name="title" placeholder="Title" value={newTask.title} onChange={handleInputChange} className="border p-2 rounded w-full mb-2" />
            <input type="datetime-local" name="startTime" value={newTask.startTime} onChange={handleInputChange} className="border p-2 rounded w-full mb-2" />
            <input type="datetime-local" name="endTime" value={newTask.endTime} onChange={handleInputChange} className="border p-2 rounded w-full mb-2" />
            <select name="priority" value={newTask.priority} onChange={handleInputChange} className="border p-2 rounded w-full mb-2">
              <option value="">Select Priority</option>
              {[1, 2, 3, 4, 5].map((p) => (
                <option key={p} value={p}>
                  Priority {p}
                </option>
              ))}
            </select>
            <select name="status" value={newTask.status} onChange={handleInputChange} className="border p-2 rounded w-full mb-4">
              <option value="pending">Pending</option>
              <option value="finished">Finished</option>
            </select>
            <button onClick={handleSaveTask} className="bg-green-500 text-white px-4 py-2 rounded mr-2">Save</button>
            <button onClick={() => setShowModal(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;