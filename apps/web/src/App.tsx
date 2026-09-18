import { useState } from "react";
import { createReadLaterHooks, createReadLaterMutations } from "shared-core";
import "./App.css";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";
const { useArticles, useReadLater } = createReadLaterHooks(apiUrl);
const { useAddReadLaterItem, useRemoveReadLaterItem } =
  createReadLaterMutations(apiUrl);

function Bookmark({ saved = false }: { saved?: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill={saved ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M6 3h12v18l-6-4-6 4V3Z" />
    </svg>
  );
}

function App() {
  const [tab, setTab] = useState<"articles" | "saved">("articles");
  const articlesQuery = useArticles();
  const readLaterQuery = useReadLater();

  const addReadLater = useAddReadLaterItem();
  const removeReadLater = useRemoveReadLaterItem();
  const savedIds = new Set(
    readLaterQuery.data?.items.map((item) => item.articleId),
  );
  const articles = articlesQuery.data?.items ?? [];

  const displayedArticles =
    tab === "saved"
      ? articles.filter((article) => savedIds.has(article.id))
      : articles;

  const loading = articlesQuery.isPending || readLaterQuery.isPending;
  const failed = articlesQuery.isError || readLaterQuery.isError;
  const busy = addReadLater.isPending || removeReadLater.isPending;

  return (
    <>
      <main className="content">
        <header>
          <h1>{tab === "articles" ? "Latest Articles" : "Read Later"}</h1>
          {tab === "saved" && <p>Articles you've saved for later</p>}
        </header>
        {(addReadLater.isError || removeReadLater.isError) && (
          <p role="alert" className="error">
            Could not update your bookmarks. Please try again.
          </p>
        )}
        {loading ? (
          <p role="status">Loading articles…</p>
        ) : failed ? (
          <div role="alert" className="empty">
            <p>Failed to load articles or bookmarks.</p>
            <button
              onClick={() => {
                void articlesQuery.refetch();
                void readLaterQuery.refetch();
              }}
            >
              Try again
            </button>
          </div>
        ) : displayedArticles.length === 0 ? (
          <div className="empty" role="status">
            <Bookmark />
            <h2>{tab === "saved" ? "Nothing saved yet" : "No articles yet"}</h2>
            <p>
              {tab === "saved"
                ? "Articles you save will appear here."
                : "Check back for new articles."}
            </p>
          </div>
        ) : (
          <ul className="articles">
            {displayedArticles.map((item) => {
              const isSaved = savedIds.has(item.id);
              return (
                <li key={item.id}>
                  <article className="card">
                    <img src={item.imageUrl} alt="" loading="lazy" />
                    <div className="card-content">
                      <div className="card-header">
                        <span className="section">{item.section}</span>
                        <button
                          className="bookmark"
                          aria-label={`${isSaved ? "Remove" : "Save"} ${item.title}${isSaved ? " from" : " to"} Read Later`}
                          aria-pressed={isSaved}
                          disabled={busy}
                          onClick={() => {
                            addReadLater.reset();
                            removeReadLater.reset();
                            if (isSaved) removeReadLater.mutate(item.id);
                            else addReadLater.mutate(item.id);
                          }}
                        >
                          <Bookmark saved={isSaved} />
                        </button>
                      </div>
                      <h2>{item.title}</h2>
                      <p>{item.summary}</p>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        )}
      </main>
      <nav className="bottom-tabs" aria-label="Main navigation">
        <button
          aria-current={tab === "articles" ? "page" : undefined}
          onClick={() => setTab("articles")}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <path d="m3 10 9-7 9 7v11h-6v-7H9v7H3V10Z" />
          </svg>
          Articles
        </button>
        <button
          aria-current={tab === "saved" ? "page" : undefined}
          onClick={() => setTab("saved")}
        >
          <Bookmark saved={tab === "saved"} />
          Read Later
        </button>
      </nav>
    </>
  );
}

export default App;
