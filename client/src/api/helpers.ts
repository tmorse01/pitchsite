import { API_BASE_URL } from "./config";
import { getAuthToken, handleAuthError } from "./auth";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
  timeout?: number;
}

/**
 * Base API request helper with error handling, timeout, and auth
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const {
    requiresAuth = false,
    timeout = 30000,
    headers: customHeaders = {},
    ...fetchOptions
  } = options;

  try {
    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    // Prepare headers
    const headers = new Headers({
      "Content-Type": "application/json",
      ...customHeaders,
    });

    // Add auth header if required
    if (requiresAuth) {
      const token = getAuthToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    }

    // Make the request
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...fetchOptions,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Handle different response types
    const contentType = response.headers.get("content-type");
    let responseData: any;

    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    // Handle HTTP errors
    if (!response.ok) {
      if (response.status === 401 && requiresAuth) {
        handleAuthError();
      }

      return {
        success: false,
        error:
          responseData?.message || responseData || `HTTP ${response.status}`,
      };
    }

    return {
      success: true,
      data: responseData,
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        return {
          success: false,
          error: "Request timeout",
        };
      }

      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "An unknown error occurred",
    };
  }
}

/**
 * GET request helper
 */
export function apiGet<T = any>(
  endpoint: string,
  options: Omit<RequestOptions, "method"> = {}
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    ...options,
    method: "GET",
  });
}

/**
 * POST request helper
 */
export function apiPost<T = any>(
  endpoint: string,
  data?: any,
  options: Omit<RequestOptions, "method" | "body"> = {}
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    ...options,
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * PUT request helper
 */
export function apiPut<T = any>(
  endpoint: string,
  data?: any,
  options: Omit<RequestOptions, "method" | "body"> = {}
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    ...options,
    method: "PUT",
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * DELETE request helper
 */
export function apiDelete<T = any>(
  endpoint: string,
  options: Omit<RequestOptions, "method"> = {}
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    ...options,
    method: "DELETE",
  });
}

/**
 * PATCH request helper
 */
export function apiPatch<T = any>(
  endpoint: string,
  data?: any,
  options: Omit<RequestOptions, "method" | "body"> = {}
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    ...options,
    method: "PATCH",
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * Helper for handling API responses consistently
 */
export function handleApiResponse<T>(response: ApiResponse<T>): T {
  if (!response.success) {
    throw new Error(response.error || "API request failed");
  }
  return response.data as T;
}

/**
 * Helper for creating query keys for react-query
 */
export const queryKeys = {
  pitchDecks: {
    all: ["pitchDecks"] as const,
    detail: (id: string) => ["pitchDecks", "detail", id] as const,
    byUser: (userId: string) => ["pitchDecks", "byUser", userId] as const,
  },
  generation: {
    all: ["generation"] as const,
    test: () => ["generation", "test"] as const,
  },
} as const;
