import express from "express";
import cors from "cors";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type {
  ArticlesResponse,
  ReadLaterItem,
  ReadLaterResponse,
} from "shared-core";
import { writeFile } from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const articlesPath = path.join(__dirname, "../data/articles.json");
const readLaterPath = path.join(__dirname, "../data/read-later.json");

const app = express();
const PORT = 3001;
const NETWORK_DELAY_MS = 300;
const SHOULD_FAIL_MUTATIONS = process.env.MOCK_FAIL_MUTATIONS === "true";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const shouldFailMutation = () => SHOULD_FAIL_MUTATIONS;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "Read Later mock API is running",
  });
});

app.get("/articles", async (_req, res) => {
  try {
    const data = await readFile(articlesPath, "utf-8");
    const items = JSON.parse(data);

    const response: ArticlesResponse = {
      items,
    };
    res.json(response);
  } catch {
    res.status(500).json({
      error: "Failed to load articles",
    });
  }
});

app.get("/read-later", async (_req, res) => {
  try {
    const data = await readFile(readLaterPath, "utf-8");
    const items = JSON.parse(data);

    const response: ReadLaterResponse = {
      items,
    };
    res.json(response);
  } catch {
    res.status(500).json({
      error: "Failed to load read-later items",
    });
  }
});

app.post("/read-later", async (_req, res) => {
  try {
    await delay(NETWORK_DELAY_MS);
    if (shouldFailMutation()) {
      return res.status(500).json({
        error: "Simulated network failure",
      });
    }
    const articleId = _req.body.articleId;
    if (!articleId) {
      return res
        .status(400)
        .json({ error: "Missing articleId in request body" });
    }

    const data = await readFile(readLaterPath, "utf-8");
    const items: ReadLaterItem[] = JSON.parse(data);
    const alreadySaved = items.some(
      (item: ReadLaterItem) => item.articleId === articleId,
    );

    if (alreadySaved) {
      return res.status(409).json({ error: "Item already exists" });
    }

    const newItem: ReadLaterItem = {
      articleId: articleId,
      savedAt: new Date().toISOString(),
    };

    items.push(newItem);

    await writeFile(readLaterPath, JSON.stringify(items, null, 2), "utf-8");

    res.status(201).json({ message: "Item added to read-later" });
  } catch {
    res.status(500).json({
      error: "Failed to add item to read-later",
    });
  }
});

app.delete("/read-later/:articleId", async (_req, res) => {
  try {
    await delay(NETWORK_DELAY_MS);
    if (shouldFailMutation()) {
      return res.status(500).json({
        error: "Simulated network failure",
      });
    }
    const { articleId } = _req.params;
    if (!articleId) {
      return res
        .status(400)
        .json({ error: "Missing articleId in request body" });
    }

    const data = await readFile(readLaterPath, "utf-8");
    const items: ReadLaterItem[] = JSON.parse(data);
    const itemExists = items.some(
      (item: ReadLaterItem) => item.articleId === articleId,
    );

    if (!itemExists) {
      return res.status(404).json({ error: "Item not found" });
    }

    const updatedItems = items.filter(
      (item: ReadLaterItem) => item.articleId !== articleId,
    );

    await writeFile(
      readLaterPath,
      JSON.stringify(updatedItems, null, 2),
      "utf-8",
    );

    res.status(204).end();
  } catch {
    res.status(500).json({
      error: "Failed to remove item from read-later",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Mock API running on http://localhost:${PORT}`);
});
