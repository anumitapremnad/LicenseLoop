// API client configuration for LicenseLoop frontend
// Connects to FastAPI backend via configurable environment variable

const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:8000';

/**
 * Custom error class for API requests
 * Encapsulates HTTP status code, structured response data, and user-friendly error messages
 */
export class ApiError extends Error {
  constructor(message, status = 0, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Formats FastAPI error details into a clear, human-readable string.
 * Supports:
 * - Plain string details (e.g. HTTPException(detail="License expired"))
 * - Pydantic validation error lists (e.g. detail=[{ loc: ["body", "seats"], msg: "..." }])
 * - Arbitrary structured error objects
 * 
 * @param {any} detail - Value of the 'detail' field from a FastAPI JSON response
 * @returns {string} Formatted error message
 */
export function formatFastApiErrorDetail(detail) {
  if (!detail) return '';
  if (typeof detail === 'string') return detail;

  // FastAPI/Pydantic validation errors return an array of error objects
  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        if (typeof item === 'string') return item;
        if (!item || typeof item !== 'object') return String(item);

        // Extract field location path, ignoring generic 'body' prefix
        const fieldPath = Array.isArray(item.loc)
          ? item.loc.filter((loc) => loc !== 'body').join('.')
          : '';
        const msg = item.msg || item.message || JSON.stringify(item);

        return fieldPath ? `${fieldPath}: ${msg}` : msg;
      })
      .filter(Boolean)
      .join('; ');
  }

  // Object details
  if (typeof detail === 'object') {
    try {
      return JSON.stringify(detail);
    } catch {
      return String(detail);
    }
  }

  return String(detail);
}

/**
 * Generic fetch wrapper for FastAPI backend endpoints
 * 
 * Features:
 * - Automatically prepends API_BASE_URL and adds JSON headers
 * - Extracts detailed error messages from FastAPI responses (including Pydantic validations)
 * - Safely handles HTTP 204 No Content, invalid JSON, and empty responses
 * - Supports configurable request timeouts (default 10s) and cancellation
 * - Guarantees timeout timer and abort event-listener cleanup
 * - Provides clear error messages on network failure without crashing
 * 
 * @param {string} endpoint - API path (e.g. '/api/subscriptions' or 'health')
 * @param {RequestInit & { timeout?: number }} [options={}] - Fetch options plus optional timeout in ms
 * @returns {Promise<any>} Parsed JSON response, null for 204 No Content, or text fallback
 */
export async function fetchApi(endpoint, options = {}) {
  const { timeout = 10000, signal: externalSignal, ...fetchOptions } = options;
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  // Configure timeout controller
  const controller = new AbortController();
  let timedOut = false;
  let timeoutId = null;

  if (timeout > 0) {
    timeoutId = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, timeout);
  }

  // Forward external cancellation signal if provided
  const onExternalAbort = () => controller.abort();
  if (externalSignal) {
    if (externalSignal.aborted) {
      controller.abort();
    } else {
      externalSignal.addEventListener('abort', onExternalAbort, { once: true });
    }
  }

  let response;
  try {
    response = await fetch(url, {
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...fetchOptions.headers,
      },
      signal: controller.signal,
    });
  } catch (error) {
    if (timedOut) {
      throw new ApiError(`Request to '${endpoint}' timed out after ${timeout}ms.`, 408);
    }
    if (externalSignal?.aborted || error.name === 'AbortError') {
      throw new ApiError(`Request to '${endpoint}' was cancelled.`, 499);
    }
    // Network disconnection, CORS rejection, or server down
    throw new ApiError(
      `Network connection failed when reaching '${API_BASE_URL}'. Verify FastAPI server is online.`,
      0
    );
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
    if (externalSignal) {
      externalSignal.removeEventListener('abort', onExternalAbort);
    }
  }

  // Handle HTTP 204 No Content and HTTP 205 Reset Content
  if (response.status === 204 || response.status === 205) {
    return null;
  }

  // Safely read response body
  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');

  let responseData = null;
  let rawText = '';

  try {
    rawText = await response.text();
    if (rawText && rawText.trim().length > 0) {
      if (isJson) {
        responseData = JSON.parse(rawText);
      } else {
        // Fallback: try parsing JSON even if header is missing/text
        try {
          responseData = JSON.parse(rawText);
        } catch {
          responseData = rawText;
        }
      }
    }
  } catch {
    responseData = null;
  }

  // Handle unsuccessful HTTP response codes (4xx, 5xx)
  if (!response.ok) {
    let errorMessage = '';

    if (responseData && typeof responseData === 'object' && responseData.detail) {
      errorMessage = formatFastApiErrorDetail(responseData.detail);
    } else if (typeof responseData === 'string' && responseData.trim() && !responseData.trim().startsWith('<')) {
      errorMessage = responseData.length > 200 ? `${responseData.slice(0, 200)}...` : responseData;
    }

    if (!errorMessage) {
      errorMessage = `API error: ${response.status} ${response.statusText || 'Request failed'}`;
    }

    throw new ApiError(errorMessage, response.status, responseData);
  }

  return responseData;
}

/**
 * Lightweight health probe to check FastAPI connectivity
 * Safe: fails gracefully without throwing unhandled exceptions
 * Reliably cleans up its abort timer in all execution paths
 * 
 * @returns {Promise<{ connected: boolean, status: string, url: string, message?: string }>}
 */
export async function checkBackendHealth() {
  let timeoutId = null;
  try {
    const controller = new AbortController();
    timeoutId = setTimeout(() => controller.abort(), 2500);

    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal,
    });

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
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

export { API_BASE_URL };
