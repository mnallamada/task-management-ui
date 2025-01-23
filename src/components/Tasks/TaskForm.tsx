import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../services/api";
import { Task, User } from "../../types";

const TaskForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>(); // `id` will be undefined for new tasks
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("To-Do");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState<string | undefined>();
  const [assigneeId, setAssigneeId] = useState<number | undefined>();
  const [assignees, setAssignees] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all users for assignment
  useEffect(() => {
    const fetchAssignees = async () => {
      try {
        const response = await API.get("/auth/users");
        setAssignees(response.data);
      } catch (err: any) {
        console.error("Failed to fetch assignees:", err);
      }
    };

    fetchAssignees();
  }, []);

  useEffect(() => {
    // Fetch task details if editing an existing task
    const fetchTask = async () => {
      if (id) {
        try {
          setLoading(true);
          const response = await API.get(`/tasks/${id}`);
          const task: Task = response.data;
          setTitle(task.title);
          setDescription(task.description || "");
          setStatus(task.status);
          setPriority(task.priority);
          setDueDate(task.due_date ? task.due_date.split("T")[0] : undefined); // Format date
          setAssigneeId(task.assignee_id || undefined);
          setLoading(false);
        } catch (err: any) {
          setError(err.response?.data?.detail || "Failed to load task details");
          setLoading(false);
        }
      }
    };

    fetchTask();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const taskData = {
      title,
      description,
      status,
      priority,
      due_date: dueDate ? new Date(dueDate).toISOString() : null,
      assignee_id: assigneeId || null,
    };
  
    try {
      setLoading(true);
      if (id) {
        await API.put(`/tasks/${id}`, taskData); // Update task
        alert("Task updated successfully!");
      } else {
        await API.post("/tasks", taskData); // Create new task
        alert("Task created successfully!");
      }
      navigate("/"); // Redirect to task list
    } catch (err: any) {
      // Extract detailed error messages
      const errorDetail = err.response?.data?.detail;
  
      if (Array.isArray(errorDetail)) {
        // Handle multiple validation errors
        const errorMessages = errorDetail.map(
          (error: any) => `${error.loc[1]}: ${error.msg}`
        );
        setError(errorMessages.join(", "));
      } else if (typeof errorDetail === "string") {
        // Handle single error
        setError(errorDetail);
      } else {
        // Fallback error message
        setError("Failed to save task. Please try again.");
      }
      setLoading(false);
    }
  };  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold mb-4">
          {id ? "Edit Task" : "Create Task"}
        </h2>
        {loading && (
          <div className="flex justify-center mb-4">
            <svg
              className="animate-spin h-8 w-8 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
          </div>
        )}
        {error && (
          <div className="bg-red-100 text-red-800 p-2 rounded mb-4">
            {error}
          </div>
        )}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>To-Do</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Due Date
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Assign To
          </label>
          <select
            value={assigneeId || ""}
            onChange={(e) => setAssigneeId(Number(e.target.value) || undefined)}
            className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Not Assigned</option>
            {assignees.map((user) => (
              <option key={user.email} value={user.id}>
                {user.email}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center space-x-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            disabled={loading}
          >
            {id ? "Update Task" : "Create Task"}
          </button>
          <button
            type="button"
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-300"
            onClick={() => navigate("/")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
