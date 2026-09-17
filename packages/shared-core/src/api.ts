import type { ArticlesResponse, ReadLaterResponse } from "./types";

export const createApiClient = (baseUrl: string) => {
  const getArticles = async (): Promise<ArticlesResponse> => {
    const response = await fetch(`${baseUrl}/articles`);
    if (!response.ok) {
      throw new Error(`Failed to fetch articles: ${response.statusText}`);
    }
    return response.json();
  };

  const getReadLaterItems = async (): Promise<ReadLaterResponse> => {
    const response = await fetch(`${baseUrl}/read-later`);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch read later items: ${response.statusText}`,
      );
    }
    return response.json();
  };

  const addReadLaterItem = async (articleId: string): Promise<void> => {
    const response = await fetch(`${baseUrl}/read-later`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ articleId }),
    });

    if (response.status === 409) {
      return;
    }

    if (!response.ok) {
      const error = await response.json().catch(() => null);

      throw new Error(
        error?.error ?? `Failed to add read later item (${response.status})`,
      );
    }
  };

  const removeReadLaterItem = async (articleId: string): Promise<void> => {
    const response = await fetch(`${baseUrl}/read-later/${articleId}`, {
      method: "DELETE",
    });

    if (response.status === 404) {
      return;
    }

    if (!response.ok) {
      const error = await response.json().catch(() => null);

      throw new Error(
        error?.error ?? `Failed to remove read later item (${response.status})`,
      );
    }
  };

  return {
    getArticles,
    getReadLaterItems,
    addReadLaterItem,
    removeReadLaterItem,
  };
};
