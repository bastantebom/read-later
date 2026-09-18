import { useIsMutating, useMutation, useQueryClient } from "@tanstack/react-query";

import { createApiClient } from "./api";
import { queryKeys } from "./queryKeys";
import type { ReadLaterResponse } from "./types";

export const createReadLaterMutations = (baseUrl: string) => {
  const api = createApiClient(baseUrl);
  const mutationKey = ["read-later-write", baseUrl];
  const useReadLaterBusy = () => useIsMutating({ mutationKey }) > 0;

  const useAddReadLaterItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationKey,
      mutationFn: api.addReadLaterItem,

      onMutate: async (articleId: string) => {
        // Reject overlap before changing the cache or sending another request.
        if (queryClient.isMutating({ mutationKey }) > 1) {
          throw new Error("A bookmark update is already in progress");
        }

        await queryClient.cancelQueries({ queryKey: queryKeys.readLater });
        const previousReadLaterItems =
          queryClient.getQueryData<ReadLaterResponse>(queryKeys.readLater);

        queryClient.setQueryData<ReadLaterResponse>(
          queryKeys.readLater,
          (old) => {
            if (!old) return old;
            if (old.items.some((item) => item.articleId === articleId)) {
              return old;
            }

            return {
              ...old,
              items: [
                ...old.items,
                {
                  articleId,
                  savedAt: new Date().toISOString(),
                },
              ],
            };
          },
        );

        return { previousReadLaterItems };
      },

      onError: (_error, _articleId, context) => {
        if (context?.previousReadLaterItems) {
          queryClient.setQueryData(
            queryKeys.readLater,
            context.previousReadLaterItems,
          );
        }
      },

      onSettled: (_data, _error, _variables, context) => {
        if (!context) return;
        return queryClient.invalidateQueries({ queryKey: queryKeys.readLater });
      },
    });
  };

  const useRemoveReadLaterItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationKey,
      mutationFn: api.removeReadLaterItem,
      onMutate: async (articleId: string) => {
        // Reject overlap before changing the cache or sending another request.
        if (queryClient.isMutating({ mutationKey }) > 1) {
          throw new Error("A bookmark update is already in progress");
        }

        await queryClient.cancelQueries({ queryKey: queryKeys.readLater });
        const previousReadLaterItems =
          queryClient.getQueryData<ReadLaterResponse>(queryKeys.readLater);

        queryClient.setQueryData<ReadLaterResponse>(
          queryKeys.readLater,
          (old) => {
            if (!old) return old;

            return {
              ...old,
              items: old.items.filter((item) => item.articleId !== articleId),
            };
          },
        );

        return { previousReadLaterItems };
      },

      onError: (_error, _articleId, context) => {
        if (context?.previousReadLaterItems) {
          queryClient.setQueryData(
            queryKeys.readLater,
            context.previousReadLaterItems,
          );
        }
      },

      onSettled: (_data, _error, _variables, context) => {
        if (!context) return;
        return queryClient.invalidateQueries({ queryKey: queryKeys.readLater });
      },
    });
  };

  return {
    useReadLaterBusy,
    useAddReadLaterItem,
    useRemoveReadLaterItem,
  };
};
