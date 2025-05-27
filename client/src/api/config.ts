// Get API base URL from environment variables
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001";

// Authentication storage key
export const AUTH_STORAGE_KEY = "pitchsite_auth";
