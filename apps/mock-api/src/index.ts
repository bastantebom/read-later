import express from "express";
import cors from "cors";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { ArticlesResponse, ReadLaterItem, ReadLaterResponse } from "shared-core";
import { writeFile } from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const articlesPath = path.join(__dirname, "../data/articles.json");
const readLaterPath = path.join(__dirname, "../data/read-later.json");

const app = express();
const PORT = 3001;

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
    const readLaterId = _req.body.articleId;
    const savedAt = new Date().toISOString();
    const newItem: ReadLaterItem = { articleId: readLaterId, savedAt };

    const data = await readFile(readLaterPath, "utf-8");
    const items: ReadLaterItem[] = JSON.parse(data);
    if(items.some((item: ReadLaterItem) => item.articleId === readLaterId)) {
      return res.status(409).json({ error: "Item already exists" });
    }
    items.push(newItem);

    await writeFile(readLaterPath, JSON.stringify(items, null, 2), "utf-8");
    res.status(201).json({ message: "Item added to read-later" });
  }
  catch {
    res.status(500).json({
      error: "Failed to add item to read-later",
    });
  }

})

app.listen(PORT, () => {
  console.log(`Mock API running on http://localhost:${PORT}`);
});