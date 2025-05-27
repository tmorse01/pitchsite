// Re-export all types
export type {
  FormData,
  GeneratedContent,
  PitchData,
  SavePitchDeckOptions,
  SavePitchDeckResponse,
  GetPitchDeckResponse,
  IncrementViewResponse,
  TestApiResponse,
} from "./types";

// Re-export configuration
export { API_BASE_URL, AUTH_STORAGE_KEY } from "./config";

// Re-export auth utilities
export { getAuthToken, handleAuthError, createHeaders } from "./auth";

// Re-export generation APIs
export { generatePitchDeck, testApi } from "./generateApi";

// Re-export pitch deck APIs
export {
  savePitchDeck,
  getPitchDeck,
  incrementViewCount,
} from "./pitchDeckApi";
