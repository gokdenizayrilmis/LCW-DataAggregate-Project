import { Store, CreateStoreRequest, UpdateStoreRequest } from '../types';

const API_BASE_URL = 'http://localhost:5283/api';

export const storeApi = {
  // Get all stores
  getAll: async (): Promise<Store[]> => {
    const response = await fetch(`${API_BASE_URL}/stores`);
    if (!response.ok) {
      throw new Error('Failed to fetch stores');
    }
    return response.json();
  },

  // Get store by ID
  getById: async (id: number): Promise<Store> => {
    const response = await fetch(`${API_BASE_URL}/stores/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch store');
    }
    return response.json();
  },

  // Create new store
  create: async (store: CreateStoreRequest): Promise<Store> => {
    const response = await fetch(`${API_BASE_URL}/stores`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(store),
    });
    if (!response.ok) {
      throw new Error('Failed to create store');
    }
    return response.json();
  },

  // Update store
  update: async (id: number, store: UpdateStoreRequest): Promise<Store> => {
    const response = await fetch(`${API_BASE_URL}/stores/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(store),
    });
    if (!response.ok) {
      throw new Error('Failed to update store');
    }
    return response.json();
  },

  // Delete store
  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/stores/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete store');
    }
  },
}; 