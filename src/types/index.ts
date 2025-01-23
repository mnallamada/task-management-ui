/**
 * Represents a User object.
 */
export interface User {
    id?: number; // Add `id` if needed for fetching and managing users.
    email: string;
    password?: string; // Optional field for scenarios where password might be included (e.g., signup).
  }
  
  /**
   * Represents the authentication context for the app.
   */
  export interface AuthContextType {
    user: User | null; // The logged-in user or null if not authenticated.
    login: (email: string, password: string) => Promise<void>; // Function to log in a user.
    logout: () => void; // Function to log out the user.
  }
  
  /**
   * Represents a Task object.
   */
  export interface Task {
    id: number; // Unique identifier for the task.
    title: string; // The title of the task.
    description: string; // Optional description of the task.
    status: string; // The current status (e.g., "To-Do", "In Progress", "Completed").
    priority: string; // Priority level (e.g., "Low", "Medium", "High").
    due_date: string | null; // Due date for the task, if any.
    created_at: string; // When the task was created.
    owner_id: number; // The ID of the user who created the task.
    assignee_id?: number; // Optional field for the user the task is assigned to.
    assignee_name?: string; // Optional field for the user the task is assigned to.
  }
  