import { Router, type IRouter } from "express";
import { eq, asc } from "drizzle-orm";
import { db, linkedinPostsTable } from "@workspace/db";
import { CreateLinkedinPostBody, DeleteLinkedinPostParams } from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/requireAdmin";

const router: IRouter = Router();

function deriveEmbedUrl(postUrl: string): string | null {
  // Pattern: .../posts/slug-activity-DIGITS-SHORTCODE
  const activityMatch = postUrl.match(/activity-(\d{10,})-[A-Za-z0-9_-]+(?:[/?#].*)?$/);
  if (activityMatch) {
    return `https://www.linkedin.com/embed/feed/update/urn:li:activity:${activityMatch[1]}`;
  }
  // Pattern: .../feed/update/urn:li:share:DIGITS or urn:li:ugcPost:DIGITS or urn:li:activity:DIGITS
  const feedMatch = postUrl.match(/\/feed\/update\/(urn:li:[^?#\s]+)/);
  if (feedMatch) {
    return `https://www.linkedin.com/embed/feed/update/${feedMatch[1]}`;
  }
  // Pattern: direct share ID in URL like ?share=DIGITS
  const shareMatch = postUrl.match(/\/posts\/[^/]+-(\d{10,})(?:[/?#].*)?$/);
  if (shareMatch) {
    return `https://www.linkedin.com/embed/feed/update/urn:li:activity:${shareMatch[1]}`;
  }
  return null;
}

router.get("/linkedin-posts", async (_req, res): Promise<void> => {
  const posts = await db
    .select()
    .from(linkedinPostsTable)
    .orderBy(asc(linkedinPostsTable.order), asc(linkedinPostsTable.createdAt));
  res.json(posts);
});

router.post("/linkedin-posts", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateLinkedinPostBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const embedUrl = deriveEmbedUrl(parsed.data.postUrl);
  if (!embedUrl) {
    res.status(400).json({ error: "Could not derive a LinkedIn embed URL from the provided post URL. Please use a direct post link." });
    return;
  }
  const [post] = await db.insert(linkedinPostsTable).values({
    postUrl: parsed.data.postUrl,
    embedUrl,
    label: parsed.data.label ?? null,
    order: parsed.data.order ?? 0,
  }).returning();
  res.status(201).json(post);
});

router.delete("/linkedin-posts/:id", requireAdmin, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const [post] = await db.delete(linkedinPostsTable).where(eq(linkedinPostsTable.id, id)).returning();
  if (!post) {
    res.status(404).json({ error: "LinkedIn post not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
