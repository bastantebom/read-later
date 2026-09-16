import express from "express";
import cors from "cors";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

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
    const articles = JSON.parse(data);

    res.json({
      items: articles,
    });
  } catch {
    res.status(500).json({
      error: "Failed to load articles",
    });
  }
});

app.get("/read-later", async (_req, res) => {
  try {
    const data = await readFile(readLaterPath, "utf-8");
    const readLater = JSON.parse(data);

    res.json({
      items: readLater,
    });
  } catch {
    res.status(500).json({
      error: "Failed to load read-later items",
    });
  }
});


app.listen(PORT, () => {
  console.log(`Mock API running on http://localhost:${PORT}`);
});