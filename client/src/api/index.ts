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

// Re-export API helpers
export {
  apiRequest,
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
  apiPatch,
  handleApiResponse,
  queryKeys,
} from "./helpers";

// Re-export React Query setup
export { queryClient, createQueryKey } from "./queryClient";

// Re-export React Query hooks
export {
  usePitchDeck,
  useSavePitchDeck,
  useIncrementViewCount,
  usePrefetchPitchDeck,
  useTestApi,
  useGeneratePitchDeck,
  useLogin,
  useVerifyToken,
} from "./hooks";
