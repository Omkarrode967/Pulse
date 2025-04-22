import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8081/api';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const taskService = {
  // Fetch all tasks for a user
  getUserTasks: async (userEmail) => {
    try {
      const response = await axiosInstance.get(`/tasks/user/${userEmail}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user tasks:', error);
      throw error;
    }
  },

  // Fetch tasks for a specific project
  getProjectTasks: async (projectId) => {
    try {
      const response = await axiosInstance.get(`/tasks/project/${projectId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching project tasks:', error);
      throw error;
    }
  },

  // Create a new task
  createTask: async (taskData) => {
    try {
      const response = await axiosInstance.post('/tasks', taskData);
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  // Update a task
  updateTask: async (taskId, taskData) => {
    try {
      const response = await axiosInstance.put(`/tasks/${taskId}`, taskData);
      return response.data;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  // Delete a task
  deleteTask: async (taskId) => {
    try {
      const response = await axiosInstance.delete(`/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },

  // Update task status
  updateTaskStatus: async (taskId, status) => {
    try {
      const response = await axiosInstance.patch(`/tasks/${taskId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating task status:', error);
      throw error;
    }
  },

  // Update task progress
  updateTaskProgress: async (taskId, progress) => {
    try {
      const response = await axiosInstance.patch(`/tasks/${taskId}/progress`, { progress });
      return response.data;
    } catch (error) {
      console.error('Error updating task progress:', error);
      throw error;
    }
  },

  // Get task statistics
  getTaskStats: async (userEmail) => {
    try {
      const response = await axiosInstance.get(`/tasks/stats/${userEmail}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching task statistics:', error);
      throw error;
    }
  }
};

export default taskService; 