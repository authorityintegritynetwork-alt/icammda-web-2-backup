import { Router, type IRouter } from "express";

const router: IRouter = Router();

const CHANNEL_ID = "UCualtZFLn6fPavJVfABof6g";
const UPLOADS_PLAYLIST = "UUualtZFLn6fPavJVfABof6g";
const YT_BASE = "https://www.googleapis.com/youtube/v3";

function apiKey() {
  return process.env.YOUTUBE_API_KEY ?? "";
}

// Simple in-memory cache (5 min TTL)
let playlistsCache: { data: unknown; at: number } | null = null;
let uploadsCache: { data: unknown; at: number } | null = null;
const TTL = 5 * 60 * 1000;

async function ytFetch(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`YouTube API error: ${res.status}`);
  return res.json();
}

// GET /youtube/playlists — all playlists for the channel
router.get("/youtube/playlists", async (_req, res): Promise<void> => {
  if (!apiKey()) {
    res.status(503).json({ error: "YouTube API not configured" });
    return;
  }
  try {
    if (playlistsCache && Date.now() - playlistsCache.at < TTL) {
      res.json(playlistsCache.data);
      return;
    }
    const url = `${YT_BASE}/playlists?part=snippet,contentDetails&channelId=${CHANNEL_ID}&maxResults=50&key=${apiKey()}`;
    const data = await ytFetch(url);
    playlistsCache = { data, at: Date.now() };
    res.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});

// GET /youtube/playlist/:id — videos inside a specific playlist
router.get("/youtube/playlist/:id", async (req, res): Promise<void> => {
  if (!apiKey()) {
    res.status(503).json({ error: "YouTube API not configured" });
    return;
  }
  const id = req.params.id as string;
  try {
    const url = `${YT_BASE}/playlistItems?part=snippet&playlistId=${id}&maxResults=50&key=${apiKey()}`;
    const data = await ytFetch(url);
    res.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});

// GET /youtube/uploads — latest uploads (no playlist needed)
router.get("/youtube/uploads", async (_req, res): Promise<void> => {
  if (!apiKey()) {
    res.status(503).json({ error: "YouTube API not configured" });
    return;
  }
  try {
    if (uploadsCache && Date.now() - uploadsCache.at < TTL) {
      res.json(uploadsCache.data);
      return;
    }
    const url = `${YT_BASE}/playlistItems?part=snippet&playlistId=${UPLOADS_PLAYLIST}&maxResults=20&key=${apiKey()}`;
    const data = await ytFetch(url);
    uploadsCache = { data, at: Date.now() };
    res.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});

export default router;
