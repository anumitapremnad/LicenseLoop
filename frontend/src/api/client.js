// API client configuration for LicenseLoop frontend
// Connects to FastAPI backend via configurable environment variable

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

/**
 * Generic fetch wrapper for FastAPI backend endpoints
 * @param {string} endpoint - Path such as '/health' or '/api/subscriptions'
 * @param {RequestInit} options - Fetch options
 */
export async function fetchApi(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Lightweight health probe to check FastAPI connectivity
 * Safe: fails gracefully without throwing unhandled exceptions
 */
export async function checkBackendHealth() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      return { connected: true, status: 'Online', url: API_BASE_URL };
    }
    return { connected: false, status: 'Unreachable', url: API_BASE_URL };
  } catch (error) {
    return {
      connected: false,
      status: 'Standby / Offline',
      url: API_BASE_URL,
      message: error?.message || 'FastAPI backend offline.',
    };
  }
}

export { API_BASE_URL };
