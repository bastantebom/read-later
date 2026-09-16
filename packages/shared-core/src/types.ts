export type Article = {
  id: string;
  title: string;
  summary: string;
  publishedAt: string;
  imageUrl: string;
  section: string;
};

export type ReadLaterItem = {
  articleId: string;
  savedAt: string;
};

export type ArticlesResponse = {
  items: Article[];
};

export type ReadLaterResponse = {
  items: ReadLaterItem[];
};