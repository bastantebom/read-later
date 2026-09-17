import { useQuery } from "@tanstack/react-query";
import { createApiClient } from "./api";
import { queryKeys } from "./queryKeys";

export const createReadLaterHooks = (baseUrl: string) => {
  const api = createApiClient(baseUrl);

  const useArticles = () => {
    return useQuery({
      queryKey: queryKeys.articles,
      queryFn: api.getArticles,
    });
  };

  const useReadLater = () => {
    return useQuery({
      queryKey: queryKeys.readLater,
      queryFn: api.getReadLaterItems,
    });
  };

  return {
    useArticles,
    useReadLater,
  };
};
