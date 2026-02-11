import { bffApiClient } from '../lib/api-client';

// Define the Task interface
export interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
}

// Task service with API methods for task CRUD operations
export const taskService = {
  /**
   * Get all tasks for the authenticated user
   */
  getTasks: async (): Promise<Task[]> => {
    try {
      return await bffApiClient.getTodos();
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },

  /**
   * Get a specific task by ID
   */
  getTaskById: async (id: number): Promise<Task> => {
    try {
      return await bffApiClient.getTodoById(id);
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new task
   */
  createTask: async (taskData: { title: string; description?: string; completed?: boolean }): Promise<Task> => {
    try {
      return await bffApiClient.createTodo(taskData);
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  /**
   * Update an existing task
   */
  updateTask: async (id: number, taskData: { title?: string; description?: string; completed?: boolean }): Promise<Task> => {
    try {
      return await bffApiClient.updateTodo(id, taskData);
    } catch (error) {
      console.error(`Error updating task with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a task by ID
   */
  deleteTask: async (id: number): Promise<void> => {
    try {
      await bffApiClient.deleteTodo(id);
    } catch (error) {
      console.error(`Error deleting task with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Toggle the completion status of a task
   */
  toggleTaskCompletion: async (id: number): Promise<Task> => {
    try {
      // First get the current task to know its current completion status
      const currentTask = await bffApiClient.getTodoById(id);

      // Update the task with the opposite completion status
      return await bffApiClient.updateTodo(id, {
        completed: !currentTask.completed
      });
    } catch (error) {
      console.error(`Error toggling task completion with ID ${id}:`, error);
      throw error;
    }
  }
};

export default taskService;