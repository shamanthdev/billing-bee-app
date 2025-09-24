import express from "express";
import cors from "cors";
import axios from "axios";
import Parser from "rss-parser";

const app = express();
const PORT = 5000;
const parser = new Parser();

app.use(cors());
app.use(express.json());

// Simple in-memory cache for RSS results
let rssCache = {
  items: [],
  fetchedAt: 0,
};
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

// Health endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: Date.now() });
});

// Helper to build an ETag string for current cache state
function buildRssETag() {
  if (!rssCache.fetchedAt) return '';
  return `W/"rss-${rssCache.fetchedAt}-${rssCache.items.length}"`;
}

// Fetch & parse VentureSoft RSS
app.get("/api/rss", async (req, res) => {
  try {
    const now = Date.now();
    if (rssCache.items.length && now - rssCache.fetchedAt < CACHE_TTL_MS) {
      // If client sent If-None-Match and it matches our current ETag, return 304
      const currentETag = buildRssETag();
      const ifNoneMatch = req.headers['if-none-match'];
      if (ifNoneMatch && currentETag && ifNoneMatch === currentETag) {
        res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
        res.setHeader('ETag', currentETag);
        res.setHeader('Last-Modified', new Date(rssCache.fetchedAt).toUTCString());
        return res.status(304).end();
      }
      res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
      res.setHeader('ETag', currentETag);
      res.setHeader('Last-Modified', new Date(rssCache.fetchedAt).toUTCString());
      return res.json(rssCache.items);
    }

    const feed = await parser.parseURL("https://venturesoft.ai/feed/");
    const items = Array.isArray(feed.items) ? feed.items : [];
    rssCache = { items, fetchedAt: now };
    const freshETag = buildRssETag();
    res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
    res.setHeader('ETag', freshETag);
    res.setHeader('Last-Modified', new Date(rssCache.fetchedAt).toUTCString());
    res.json(items); // send blog posts as JSON
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch RSS feed" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
