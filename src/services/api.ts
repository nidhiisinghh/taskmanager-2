import { auth } from '../firebase/config';

const API_URL = import.meta.env.VITE_API_URL || 'https://task-manager-bpzf.onrender.com/api';

// Helper function to get auth token
const getAuthToken = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error('No authenticated user');
  return user.getIdToken();
};

// Helper function to make API requests
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Something went wrong');
    }

    return response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Project API calls
export const projectApi = {
  create: (data: { name: string; description?: string }) =>
    apiRequest('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getAll: () =>
    apiRequest('/projects'),

  getOne: (id: string) =>
    apiRequest(`/projects/${id}`),

  update: (id: string, data: { name?: string; description?: string; status?: string }) =>
    apiRequest(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest(`/projects/${id}`, {
      method: 'DELETE',
    }),

  addMember: (id: string, memberId: string) =>
    apiRequest(`/projects/${id}/members`, {
      method: 'POST',
      body: JSON.stringify({ memberId }),
    }),
};

// Task API calls
export const taskApi = {
  create: (data: {
    title: string;
    description?: string;
    projectId: string;
    statusId: string;
    priority?: string;
    dueDate?: Date;
  }) =>
    apiRequest('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getProjectTasks: (projectId: string) =>
    apiRequest(`/tasks/project/${projectId}`),

  update: (id: string, data: any) =>
    apiRequest(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest(`/tasks/${id}`, {
      method: 'DELETE',
    }),
};