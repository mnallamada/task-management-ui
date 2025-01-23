import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import { Task } from "../../types";

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortConfig, setSortConfig] = useState<{ key: keyof Task | "assignee_name"; direction: "asc" | "desc" }>({
    key: "id", // Default column to sort by
    direction: "asc", // Default direction
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await API.get("/tasks", {
          params: {
            search: searchQuery,
          },
        });
        setTasks(response.data);
        setLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.detail || "Failed to fetch tasks");
        setLoading(false);
      }
    };

    fetchTasks();
  }, [searchQuery]);

  const handleSort = (key: keyof Task | "assignee_name") => {
    setSortConfig((prevConfig) => {
      if (prevConfig.key === key) {
        // Toggle sort direction for the same column
        return { key, direction: prevConfig.direction === "asc" ? "desc" : "asc" };
      }
      // Set new column for sorting with default ascending direction
      return { key, direction: "asc" };
    });
  };

  const sortedTasks = React.useMemo(() => {
    if (!sortConfig) return tasks;
    return [...tasks].sort((a, b) => {
      let valA = sortConfig.key === "assignee_name" ? a.assignee_name : a[sortConfig.key];
      let valB = sortConfig.key === "assignee_name" ? b.assignee_name : b[sortConfig.key];

      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;

      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();

      if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
      if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [tasks, sortConfig]);

  const getSortIcon = (key: keyof Task | "assignee_name") => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? "↑" : "↓";
    }
    return ""; // No icon if the column is not being sorted
  };

  const handleDelete = async (taskId: number) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await API.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
      alert("Task deleted successfully!");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to delete task");
    }
  };

  return (
    <div className="container mx-auto py-4">
      <h1 className="text-3xl font-bold mb-4">Your Tasks</h1>
      {error && (
        <div className="bg-red-100 text-red-800 p-2 rounded mb-4">
          {error}
        </div>
      )}
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tasks..."
          className="px-4 py-2 border rounded-lg"
        />
      </div>
      {loading ? (
        <div className="flex justify-center">
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
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2 cursor-pointer" onClick={() => handleSort("id")}>
                # {getSortIcon("id")}
              </th>
              <th className="border px-4 py-2 cursor-pointer" onClick={() => handleSort("title")}>
                Title {getSortIcon("title")}
              </th>
              <th className="border px-4 py-2 cursor-pointer" onClick={() => handleSort("description")}>
                Description {getSortIcon("description")}
              </th>
              <th className="border px-4 py-2 cursor-pointer" onClick={() => handleSort("status")}>
                Status {getSortIcon("status")}
              </th>
              <th className="border px-4 py-2 cursor-pointer" onClick={() => handleSort("priority")}>
                Priority {getSortIcon("priority")}
              </th>
              <th className="border px-4 py-2 cursor-pointer" onClick={() => handleSort("assignee_name")}>
                Assignee {getSortIcon("assignee_name")}
              </th>
              <th className="border px-4 py-2 cursor-pointer" onClick={() => handleSort("due_date")}>
                Due Date {getSortIcon("due_date")}
              </th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedTasks.map((task, index) => (
              <tr
                key={task.id}
                className={task.status === "Completed" ? "line-through" : ""}
              >
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">{task.title}</td>
                <td className="border px-4 py-2">
                  {task.description || "N/A"}
                </td>
                <td className="border px-4 py-2">{task.status}</td>
                <td className="border px-4 py-2">{task.priority}</td>
                <td className="border px-4 py-2">
                  {task.assignee_name ? task.assignee_name : "Not Assigned"}
                </td>
                <td className="border px-4 py-2">
                  {task.due_date ? new Date(task.due_date).toLocaleDateString() : "N/A"}
                </td>
                <td className="border px-4 py-2">
                  <Link to={`/tasks/${task.id}/edit`}>
                    <button className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">
                      Edit
                    </button>
                  </Link>
                  <Link to={`/tasks/${task.id}`}>
                    <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2">
                      View
                    </button>
                  </Link>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleDelete(task.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TaskList;
