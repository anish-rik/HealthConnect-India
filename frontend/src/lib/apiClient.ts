import { handleMockRequest } from "./mockApi";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem("authToken");
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem("authToken", token);
  }

  removeToken() {
    this.token = null;
    localStorage.removeItem("authToken");
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
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
        const error = await response.json().catch(() => ({}));
        // If HTTP 404/502/503 or backend error on Vercel deployment, fallback to mock mode for demo user testing
        if (response.status === 404 || response.status >= 500) {
          console.warn(`[ApiClient] Server returned status ${response.status} for ${endpoint}. Falling back to demo mode.`);
          return await handleMockRequest(endpoint, options, this.token);
        }
        throw new Error(error.error || "API request failed");
      }

      return await response.json();
    } catch (error: any) {
      console.warn(`[ApiClient] Network fetch failed for ${endpoint}:`, error.message);
      // Automatically fallback to client-side demo mode when backend server is not running or unreachable (e.g. Vercel deployment)
      try {
        const mockResult = await handleMockRequest(endpoint, options, this.token);
        if (mockResult && mockResult.token) {
          this.setToken(mockResult.token);
        }
        return mockResult;
      } catch (mockError) {
        console.error("Mock fallback failed:", mockError);
        throw error;
      }
    }
  }

  /**
   * Send a multipart/form-data request (for file uploads).
   * Do NOT set Content-Type — the browser sets it with the boundary.
   */
  async requestMultipart(endpoint, formData, method = "POST") {
    const url = `${this.baseURL}${endpoint}`;
    const headers: Record<string, string> = {};

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        if (response.status === 404 || response.status >= 500) {
          return await handleMockRequest(endpoint, { method }, this.token);
        }
        throw new Error(error.error || "API request failed");
      }

      return await response.json();
    } catch (error) {
      console.warn(`[ApiClient] Upload fetch failed for ${endpoint}, using demo fallback.`);
      return await handleMockRequest(endpoint, { method }, this.token);
    }
  }

  // Auth endpoints
  auth = {
    register: (data) =>
      this.request("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    login: (data) =>
      this.request("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    loginAbha: (data) =>
      this.request("/auth/login-abha", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    getProfile: () => this.request("/auth/profile", { method: "GET" }),
    updateProfile: (data) =>
      this.request("/auth/profile", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
  };

  // Health records endpoints
  records = {
    list: () => this.request("/records", { method: "GET" }),

    /**
     * Create a record with optional file attachments.
     * @param data  Record fields (recordType, title, description, etc.)
     * @param files Optional array of File objects to attach.
     */
    create: (data, files?: File[]) => {
      if (files && files.length > 0) {
        const formData = new FormData();
        // Append JSON fields
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, typeof value === "object" ? JSON.stringify(value) : String(value));
          }
        });
        // Append file attachments
        files.forEach((file) => formData.append("attachments", file));
        return this.requestMultipart("/records", formData);
      }

      // No files — send as JSON
      return this.request("/records", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },

    get: (id) => this.request(`/records/${id}`, { method: "GET" }),
    update: (id, data) =>
      this.request(`/records/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id) => this.request(`/records/${id}`, { method: "DELETE" }),
    share: (id, userId) =>
      this.request(`/records/${id}/share`, {
        method: "POST",
        body: JSON.stringify({ userId }),
      }),
  };

  // Appointments endpoints
  appointments = {
    list: () => this.request("/appointments", { method: "GET" }),
    create: (data) =>
      this.request("/appointments", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    get: (id) => this.request(`/appointments/${id}`, { method: "GET" }),
    update: (id, data) =>
      this.request(`/appointments/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    cancel: (id, reason) =>
      this.request(`/appointments/${id}/cancel`, {
        method: "POST",
        body: JSON.stringify({ reason }),
      }),
  };

  // ABHA endpoints
  abha = {
    verify: (abhaNumber) =>
      this.request("/abha/verify", {
        method: "POST",
        body: JSON.stringify({ abhaNumber }),
      }),
    link: (abhaNumber) =>
      this.request("/abha/link", {
        method: "POST",
        body: JSON.stringify({ abhaNumber }),
      }),
    status: () => this.request("/abha/status", { method: "GET" }),
    createConsentRequest: () => this.request("/abha/consent-request", { method: "POST" }),
    getConsentStatus: () => this.request("/abha/consent-status", { method: "GET" }),
    getHealthRecords: () => this.request("/abha/health-records", { method: "GET" }),
  };

  // Share / QR endpoints
  share = {
    generate: (data: { expiryHours?: number; label?: string; recordId?: string } = {}) =>
      this.request("/share/generate", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    listTokens: () => this.request("/share/my-tokens", { method: "GET" }),
    revoke: (tokenId: string) => this.request(`/share/${tokenId}`, { method: "DELETE" }),
    getPublicTimeline: (token: string) => this.request(`/share/public/${token}`, { method: "GET" }),
  };
}

export const apiClient = new ApiClient();
