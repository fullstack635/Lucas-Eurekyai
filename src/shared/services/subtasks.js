import { apiClient } from './api';

export const subtasksService = {
  // Get all subtasks for a specific list item
  async getSubtasks(listItemId) {
    try {
      const response = await apiClient.get(`/list-items/${listItemId}/subtasks`);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch subtasks');
    }
  },

  // Create a new subtask
  async createSubtask(listItemId, subtaskData) {
    try {
      const response = await apiClient.post(`/list-items/${listItemId}/subtasks`, subtaskData);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to create subtask');
    }
  },

  // Update a subtask
  async updateSubtask(subtaskId, updates) {
    try {
      const response = await apiClient.put(`/subtasks/${subtaskId}`, updates);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to update subtask');
    }
  },

  // Toggle subtask completion
  async toggleSubtask(subtaskId) {
    try {
      const response = await apiClient.post(`/subtasks/${subtaskId}/toggle`);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to toggle subtask');
    }
  },

  // Delete a subtask
  async deleteSubtask(subtaskId) {
    try {
      const response = await apiClient.delete(`/subtasks/${subtaskId}`);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to delete subtask');
    }
  }
};
