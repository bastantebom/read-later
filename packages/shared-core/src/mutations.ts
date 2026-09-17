import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createApiClient } from "./api";
import { queryKeys } from "./queryKeys";
import type { ReadLaterResponse } from "./types";

export const createReadLaterMutations = (baseUrl: string) => {
  const api = createApiClient(baseUrl);

  const useAddReadLaterItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: api.addReadLaterItem,

      onMutate: async (articleId: string) => {
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

      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.readLater });
      },
    });
  };

  const useRemoveReadLaterItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: api.removeReadLaterItem,
      onMutate: async (articleId: string) => {
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

      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.readLater });
      },
    });
  };

  return {
    useAddReadLaterItem,
    useRemoveReadLaterItem,
  };
};
