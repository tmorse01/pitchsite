import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys, apiPost } from "./helpers";
import { generatePitchDeck, testApi } from "./generateApi";
import {
  savePitchDeck,
  getPitchDeck,
  incrementViewCount,
} from "./pitchDeckApi";
import type {
  FormData,
  GeneratedContent,
  PitchData,
  SavePitchDeckOptions,
  SavePitchDeckResponse,
  IncrementViewResponse,
  TestApiResponse,
} from "./types";

/**
 * Hook for testing API connection
 */
export function useTestApi() {
  return useQuery({
    queryKey: queryKeys.generation.test(),
    queryFn: async (): Promise<TestApiResponse> => {
      return await testApi();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
}

/**
 * Hook for generating pitch deck content
 */
export function useGeneratePitchDeck() {
  return useMutation({
    mutationFn: async (formData: FormData): Promise<GeneratedContent> => {
      return await generatePitchDeck(formData);
    },
  });
}

/**
 * Hook for fetching a pitch deck by ID
 */
export function usePitchDeck(deckId: string, password?: string) {
  return useQuery({
    queryKey: queryKeys.pitchDecks.detail(deckId),
    queryFn: async (): Promise<PitchData> => {
      const response = await getPitchDeck(deckId, password);

      if (response.isPasswordProtected && !password) {
        throw new Error("PASSWORD_REQUIRED");
      }

      return {
        formData: response.pitchDeck.formData,
        generatedContent: response.pitchDeck.generatedContent,
      };
    },
    enabled: !!deckId,
    staleTime: 1000 * 60 * 10, // 10 minutes - pitch decks don't change often
    retry: (failureCount, error) => {
      // Don't retry if password is required
      if (error instanceof Error && error.message === "PASSWORD_REQUIRED") {
        return false;
      }
      return failureCount < 3;
    },
  });
}

/**
 * Hook for saving/creating a pitch deck
 */
export function useSavePitchDeck() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      pitchData,
      options,
    }: {
      pitchData: PitchData;
      options?: SavePitchDeckOptions;
    }): Promise<SavePitchDeckResponse> => {
      return await savePitchDeck(pitchData, options);
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch pitch decks list
      queryClient.invalidateQueries({
        queryKey: queryKeys.pitchDecks.all,
      });

      // Set the new pitch deck data in cache
      if (data.shareId) {
        queryClient.setQueryData(
          queryKeys.pitchDecks.detail(data.shareId),
          variables.pitchData
        );
      }
    },
  });
}

/**
 * Hook for incrementing view count
 */
export function useIncrementViewCount() {
  return useMutation({
    mutationFn: async (deckId: string): Promise<IncrementViewResponse> => {
      return await incrementViewCount(deckId);
    },
    // Don't need to update cache for view count increment
    // It's more of a fire-and-forget operation
  });
}

/**
 * Hook for prefetching a pitch deck (useful for preloading)
 */
export function usePrefetchPitchDeck() {
  const queryClient = useQueryClient();

  return (deckId: string, password?: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.pitchDecks.detail(deckId),
      queryFn: async (): Promise<PitchData> => {
        const response = await getPitchDeck(deckId, password);

        if (response.isPasswordProtected && !password) {
          throw new Error("PASSWORD_REQUIRED");
        }

        return {
          formData: response.pitchDeck.formData,
          generatedContent: response.pitchDeck.generatedContent,
        };
      },
      staleTime: 1000 * 60 * 10, // 10 minutes
    });
  };
}

/**
 * Hook for user authentication/login
 */
export function useLogin() {
  return useMutation({
    mutationFn: async (password: string): Promise<{ token: string }> => {
      const response = await apiPost("/login", { password });
      return response.data;
    },
  });
}

/**
 * Hook for verifying authentication token
 */
export function useVerifyToken() {
  return useQuery({
    queryKey: queryKeys.generation.test(),
    queryFn: async (): Promise<TestApiResponse> => {
      return await testApi();
    },
    enabled: false, // Only run when manually triggered
    retry: false,
    staleTime: 0,
  });
}
