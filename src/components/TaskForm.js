import React, { useState } from "react";
import { createTask } from "../services/api";

const TaskForm = ({ onTaskCreated }) => {
  const [task, setTask] = useState({ title: "", description: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await createTask(task);
      onTaskCreated(data);
      setTask({ title: "", description: "" });
    } catch (err) {
      alert("Failed to create task.");
    }
  };

  return React.createElement(
    "form",
    { onSubmit: handleSubmit, className: "bg-white p-4 rounded shadow-md" },
    React.createElement("input", {
      type: "text",
      placeholder: "Title",
      value: task.title,
      className: "block w-full mb-4 p-2 border rounded",
      onChange: (e) => setTask({ ...task, title: e.target.value }),
    }),
    React.createElement("textarea", {
      placeholder: "Description",
      value: task.description,
      className: "block w-full mb-4 p-2 border rounded",
      onChange: (e) => setTask({ ...task, description: e.target.value }),
    }),
    React.createElement(
      "button",
      { type: "submit", className: "w-full bg-blue-500 text-white py-2 rounded" },
      "Add Task"
    )
  );
};

export default TaskForm;
