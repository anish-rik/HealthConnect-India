const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('authToken');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  removeToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'API request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  auth = {
    register: (data) =>
      this.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    login: (data) =>
      this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    getProfile: () =>
      this.request('/auth/profile', { method: 'GET' }),
    updateProfile: (data) =>
      this.request('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  };

  // Health records endpoints
  records = {
    list: () =>
      this.request('/records', { method: 'GET' }),
    create: (data) =>
      this.request('/records', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    get: (id) =>
      this.request(`/records/${id}`, { method: 'GET' }),
    update: (id, data) =>
      this.request(`/records/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id) =>
      this.request(`/records/${id}`, { method: 'DELETE' }),
    share: (id, userId) =>
      this.request(`/records/${id}/share`, {
        method: 'POST',
        body: JSON.stringify({ userId }),
      }),
  };

  // Appointments endpoints
  appointments = {
    list: () =>
      this.request('/appointments', { method: 'GET' }),
    create: (data) =>
      this.request('/appointments', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    get: (id) =>
      this.request(`/appointments/${id}`, { method: 'GET' }),
    update: (id, data) =>
      this.request(`/appointments/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    cancel: (id, reason) =>
      this.request(`/appointments/${id}/cancel`, {
        method: 'POST',
        body: JSON.stringify({ reason }),
      }),
  };

  // ABHA endpoints
  abha = {
    link: (abhaId) =>
      this.request('/abha/link', {
        method: 'POST',
        body: JSON.stringify({ abhaId }),
      }),
    verify: (otp) =>
      this.request('/abha/verify', {
        method: 'POST',
        body: JSON.stringify({ otp }),
      }),
  };
}

export const apiClient = new ApiClient();
