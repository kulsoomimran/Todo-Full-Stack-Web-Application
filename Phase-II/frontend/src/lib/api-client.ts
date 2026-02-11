/**
 * API Client Wrapper
 *
 * This module provides a fetch wrapper that automatically attaches
 * the JWT token from localStorage as a Bearer header to all API requests.
 * This serves as the BFF (Backend for Frontend) pattern to forward requests
 * to the FastAPI backend with proper authentication.
 */

import { getToken } from '../services/auth';

/**
 * Fetch wrapper that automatically attaches JWT as Bearer header
 */
export const apiClient = {
  /**
   * Generic request function that adds auth header
   */
  request: async (
    url: string,
    options: RequestInit = {}
  ): Promise<Response> => {
    // Prepare headers with default content type
    const headers = new Headers(options.headers);

    // Add default content type if not present and we have a body
    if (!headers.has('Content-Type') && options.body) {
      headers.set('Content-Type', 'application/json');
    }

    // Get the JWT token from auth service and add to Authorization header
    const token = getToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  'https://kulsoomimran-todos-app.hf.space';

const requestUrl = `${BASE_URL}/api/v1${url}`;

    return fetch(requestUrl, {
      ...options,
      headers,
    });
  },

  /**
   * GET request
   */
  get: async (url: string, options?: RequestInit) => {
    return apiClient.request(url, {
      method: 'GET',
      ...options,
    });
  },

  /**
   * POST request
   */
  post: async (url: string, body?: any, options?: RequestInit) => {
    return apiClient.request(url, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    });
  },

  /**
   * PUT request
   */
  put: async (url: string, body?: any, options?: RequestInit) => {
    return apiClient.request(url, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    });
  },

  /**
   * DELETE request
   */
  delete: async (url: string, options?: RequestInit) => {
    return apiClient.request(url, {
      method: 'DELETE',
      ...options,
    });
  },
};


export const bffApiClient = {
  /**
   * Get todos - goes through Next.js API route to backend
   */
  getTodos: async (completed?: boolean) => {
    // Get token directly from sessionStorage to ensure latest value
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('jwt_token') : null;
    const url = completed !== undefined
      ? `/api/todos?completed=${completed}`
      : `/api/todos`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    return response.json();
  },

  /**
   * Create a new todo - goes through Next.js API route to backend
   */
  createTodo: async (todoData: { title: string; description?: string; completed?: boolean }) => {
    // Get token directly from sessionStorage to ensure latest value
    let token = null;
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        token = sessionStorage.getItem('jwt_token');
      }
    } catch (e) {
      console.error('Error accessing sessionStorage:', e);
    }

    const response = await fetch('/api/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(todoData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API request failed: ${response.status}, detail: ${errorData.detail || 'Unknown error'}`);
    }

    return response.json();
  },

  /**
   * Get a specific todo - goes through Next.js API route to backend
   */
  getTodoById: async (id: number) => {
    // Get token directly from sessionStorage to ensure latest value
    let token = null;
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        token = sessionStorage.getItem('jwt_token');
      }
    } catch (e) {
      console.error('Error accessing sessionStorage:', e);
    }

    const response = await fetch(`/api/todos/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API request failed: ${response.status}, detail: ${errorData.detail || 'Unknown error'}`);
    }

    return response.json();
  },

  /**
   * Update a specific todo - goes through Next.js API route to backend
   */
  updateTodo: async (id: number, todoData: { title?: string; description?: string; completed?: boolean }) => {
    // Get token directly from sessionStorage to ensure latest value
    let token = null;
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        token = sessionStorage.getItem('jwt_token');
      }
    } catch (e) {
      console.error('Error accessing sessionStorage:', e);
    }

    const response = await fetch(`/api/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(todoData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API request failed: ${response.status}, detail: ${errorData.detail || 'Unknown error'}`);
    }

    return response.json();
  },

  /**
   * Delete a specific todo - goes through Next.js API route to backend
   */
  deleteTodo: async (id: number) => {
    // Get token directly from sessionStorage to ensure latest value
    let token = null;
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        token = sessionStorage.getItem('jwt_token');
      }
    } catch (e) {
      console.error('Error accessing sessionStorage:', e);
    }

    const response = await fetch(`/api/todos/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API request failed: ${response.status}, detail: ${errorData.detail || 'Unknown error'}`);
    }

    return response;
  },
};

export default apiClient;
