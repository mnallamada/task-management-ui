import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";
import { Task, User } from "../../types";

const TaskDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const [assignee, setAssignee] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/tasks/${id}`);
        const fetchedTask = response.data;

        setTask(fetchedTask);

        // Fetch the assignee details if available
        if (fetchedTask.assignee_id) {
          const userResponse = await API.get(`/users/${fetchedTask.assignee_id}`);
          setAssignee(userResponse.data);
        } else {
          setAssignee(null);
        }

        setLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.detail || "Failed to fetch task details");
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  const handleBack = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div>
          <svg
            className="animate-spin h-8 w-8 text-blue-500 mx-auto mb-4"
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
          <p className="text-gray-600 text-center">Loading task details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-red-100 text-red-800 p-4 rounded-lg shadow-md">
          <p>{error}</p>
          <button
            onClick={handleBack}
            className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
          >
            Back to Tasks
          </button>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg shadow-md">
          <p>Task not found</p>
          <button
            onClick={handleBack}
            className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
          >
            Back to Tasks
          </button>
        </div>
      </div>
    );
  }

  const isCompleted = task.status === "Completed";

  return (
    <div className="container mx-auto py-8">
      <div className={`bg-white p-6 rounded-lg shadow-md ${isCompleted ? "line-through text-gray-500" : ""}`}>
        <h4 className="text-2xl font-bold mb-4">Task Details</h4>
        <div className="mb-4">
          <strong className="block text-gray-700">Title:</strong>
          <p>{task.title}</p>
        </div>
        <div className="mb-4">
          <strong className="block text-gray-700">Description:</strong>
          <p>{task.description || "N/A"}</p>
        </div>
        <div className="mb-4">
          <strong className="block text-gray-700">Status:</strong>
          <p>{task.status}</p>
        </div>
        <div className="mb-4">
          <strong className="block text-gray-700">Priority:</strong>
          <p>{task.priority}</p>
        </div>
        <div className="mb-4">
          <strong className="block text-gray-700">Due Date:</strong>
          <p>{task.due_date ? new Date(task.due_date).toLocaleDateString() : "N/A"}</p>
        </div>
        <div className="mb-4">
          <strong className="block text-gray-700">Created At:</strong>
          <p>{new Date(task.created_at).toLocaleDateString()}</p>
        </div>
        <div className="mb-4">
          <strong className="block text-gray-700">Assignee:</strong>
          <p>{assignee ? assignee.email : "Not Assigned"}</p>
        </div>
        <button
          onClick={handleBack}
          className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
        >
          Back to Tasks
        </button>
      </div>
    </div>
  );
};

export default TaskDetails;
