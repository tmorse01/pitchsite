import { AUTH_STORAGE_KEY } from "./config";

// Helper function to get JWT token from localStorage
export function getAuthToken(): string | null {
  const token = localStorage.getItem(AUTH_STORAGE_KEY);
  return token && token !== "authenticated" ? token : null;
}

// Helper function to handle authentication errors
export function handleAuthError(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  window.location.reload();
}

// Helper function to create headers with optional authorization
export function createHeaders(includeAuth = true): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return headers;
}
