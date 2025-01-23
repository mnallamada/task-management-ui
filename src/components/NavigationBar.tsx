import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NavigationBar: React.FC = () => {
  const { user, logout } = useAuth(); // Get user and logout function from AuthContext
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout(); // Ensure logout is asynchronous if required
      navigate("/login"); // Redirect to login page after successful logout
    } catch (error) {
      console.error("Logout failed:", error);
      alert("An error occurred while logging out. Please try again."); // Display a user-friendly error message
    }
  };

  return (
    <nav className="bg-blue-500 text-white p-4 flex justify-between items-center shadow-md">
      {/* App Logo / Home Link */}
      <Link to="/" className="text-lg font-bold hover:underline">
        Task Manager
      </Link>

      {/* Navigation Links */}
      <div className="space-x-4 flex items-center">
        {user ? (
          <>
            {/* Welcome Message */}
            <span className="font-medium">
              Welcome, {user.first_name} {user.last_name}!
            </span>

            {/* Create Task Link */}
            <Link to="/tasks/new" className="hover:underline">
              Create Task
            </Link>

            {/* Filter My Tasks */}
            <Link to="/?my_tasks=true" className="hover:underline">
              My Tasks
            </Link>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            {/* Login and Signup Links */}
            <Link to="/login" className="hover:underline">
              Login
            </Link>
            <Link to="/signup" className="hover:underline">
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavigationBar;
