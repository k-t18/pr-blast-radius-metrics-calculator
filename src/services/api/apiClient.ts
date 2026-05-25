/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Base API Client
 *
 * This module provides a centralized HTTP client using native fetch API.
 * It handles authentication, error handling, and response formatting.
 * Designed to work seamlessly with TanStack Query.
 *
 * @module apiClient
 */

import { useAuthStore } from '../../stores/authStore';
import { logoutAPI } from '../auth/logout/logout.api';
import { API_BASE_URL } from '../../constants/apiConstants';

/**
 * Navigation callback for handling redirects (e.g., 401 -> login)
 * This should be set by your App component during initialization
 */
/* eslint-disable  unicorn/no-null */
let navigateCallback: ((path: string) => void) | null = null;

/**
 * Set the navigation callback for redirects
 * Call this from your App component with the router's navigate function
 *
 * @param navigate - Navigation function from react-router-dom
 */
export function setNavigate(navigate: (path: string) => void) {
    navigateCallback = navigate;
}

/**
 * Redirect to a specific path
 * @param path - The path to redirect to
 */
function redirectTo(path: string) {
    if (navigateCallback) {
        navigateCallback(path);
    } else {
        // Fallback to window.location if navigate not set
        window.location.href = path;
    }
}

/**
 * Standard API Response structure
 * Matches the response format from your backend API
 */
export interface ApiResponse<T = any> {
    status: 'success' | 'error';
    data?: T;
    message: string;
    timestamp: string;
    error_code?: string;
    // Some endpoints also return pagination metadata
    count?: number;
}

/**
 * Custom API Error class
 * Provides structured error information for better error handling
 */
export class ApiError extends Error {
    public statusCode?: number;

    public errorCode?: string;

    public response?: any;

    constructor(message: string, statusCode?: number, errorCode?: string, response?: any) {
        super(message);
        this.name = 'ApiError';
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.response = response;

        // Maintains proper stack trace for where error was thrown (only available on V8)
        if (typeof (Error as any).captureStackTrace === 'function') {
            (Error as any).captureStackTrace(this, ApiError);
        }
    }
}

/**
 * Get CSRF token from the auth store for mutating requests
 */
export function getCsrfToken(): string | null {
    return useAuthStore.getState().csrfToken;
}

function prepareRequestBody(body?: any) {
    if (body === undefined) return;
    if (body instanceof FormData) return body;
    return JSON.stringify(body);
}

/**
 * Base fetch wrapper with error handling and authentication
 *
 * @param endpoint - API endpoint (will be appended to base URL)
 * @param options - Standard fetch options
 * @returns Promise resolving to the unwrapped data
 * @throws {ApiError} When the request fails or API returns an error
 */
export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {};

    if (options.headers) {
        const existingHeaders = new Headers(options.headers);
        Object.assign(headers, Object.fromEntries(existingHeaders.entries()));
    }

    const isFormDataBody = options.body instanceof FormData;
    if (!headers['Content-Type'] && !isFormDataBody && options.body !== undefined) {
        headers['Content-Type'] = 'application/json';
    }

    // Include CSRF token for mutating requests
    const method = (options.method ?? 'GET').toUpperCase();
    if (method !== 'GET') {
        const csrfToken = getCsrfToken();
        if (csrfToken) {
            headers['X-Frappe-CSRF-Token'] = csrfToken;
        }
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
            credentials: 'include',
        });

        // Parse JSON response
        const data: ApiResponse<T> = await response.json();

        // Check for errors (HTTP status or API status field)
        if (!response.ok || data.status === 'error') {
            const apiError = new ApiError(data.message || 'An error occurred', response.status, data.error_code, data);

            // Handle 401 Unauthorized - redirect to login
            if (response.status === 401) {
                // Expire Frappe session cookies on the backend domain.
                // Awaiting ensures the server's Set-Cookie: sid=Guest arrives
                // before we navigate away, so stale sid values don't linger.
                await logoutAPI();
                // Clear auth token from store
                useAuthStore.getState().clearToken();
                // Redirect to login page
                redirectTo('/login');
            }

            throw apiError;
        }

        // Return unwrapped data (just the payload)
        return data as T;
    } catch (error) {
        // Re-throw ApiError instances (already handled 401 above)
        if (error instanceof ApiError) {
            throw error;
        }

        // Wrap other errors (network, JSON parsing, etc.)
        throw new ApiError(error instanceof Error ? error.message : 'Network error occurred', undefined, 'NETWORK_ERROR');
    }
}

/**
 * HTTP method helpers
 * Convenience methods for common HTTP operations
 */
export const api = {
    /**
     * GET request
     * @param endpoint - API endpoint
     * @param options - Additional fetch options
     */
    get: <T>(endpoint: string, options?: RequestInit) => apiFetch<T>(endpoint, { ...options, method: 'GET' }),

    /**
     * POST request
     * @param endpoint - API endpoint
     * @param body - Request body (will be JSON stringified)
     * @param options - Additional fetch options
     */
    post: <T>(endpoint: string, body?: any, options?: RequestInit) => {
        const preparedBody = prepareRequestBody(body);

        return apiFetch<T>(endpoint, {
            ...options,
            method: 'POST',
            body: preparedBody,
        });
    },

    /**
     * PUT request
     * @param endpoint - API endpoint
     * @param body - Request body (will be JSON stringified)
     * @param options - Additional fetch options
     */
    put: <T>(endpoint: string, body?: any, options?: RequestInit) => {
        const preparedBody = prepareRequestBody(body);

        return apiFetch<T>(endpoint, {
            ...options,
            method: 'PUT',
            body: preparedBody,
        });
    },

    /**
     * PATCH request
     * @param endpoint - API endpoint
     * @param body - Request body (will be JSON stringified)
     * @param options - Additional fetch options
     */
    patch: <T>(endpoint: string, body?: any, options?: RequestInit) => {
        const preparedBody = prepareRequestBody(body);

        return apiFetch<T>(endpoint, {
            ...options,
            method: 'PATCH',
            body: preparedBody,
        });
    },

    /**
     * DELETE request
     * @param endpoint - API endpoint
     * @param options - Additional fetch options
     */
    delete: <T>(endpoint: string, options?: RequestInit) => apiFetch<T>(endpoint, { ...options, method: 'DELETE' }),
};
