export const API_BASE_URL = import.meta.env.VITE_API_URL;

export const apiClient = {
  get: (endpoint: string, token?: string) => {
    return fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
  },
  
  post: (endpoint: string, data?: any, token?: string) => {
    return fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      ...(data && { body: JSON.stringify(data) }),
    });
  },
};