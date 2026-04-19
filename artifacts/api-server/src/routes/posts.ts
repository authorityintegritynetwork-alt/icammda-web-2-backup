import { Router, type IRouter } from "express";
import { eq, desc, and } from "drizzle-orm";
import { db, postsTable } from "@workspace/db";
import {
  CreatePostBody,
  UpdatePostBody,
  UpdatePostParams,
  GetPostParams,
  DeletePostParams,
  ListPostsQueryParams,
} from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/requireAdmin";

const router: IRouter = Router();

router.get("/posts/recent", async (req, res): Promise<void> => {
  const posts = await db
    .select()
    .from(postsTable)
    .where(eq(postsTable.published, true))
    .orderBy(desc(postsTable.createdAt))
    .limit(5);
  res.json(posts);
});

router.get("/posts", async (req, res): Promise<void> => {
  const params = ListPostsQueryParams.safeParse(req.query);
  const conditions = [];
  if (params.success) {
    if (params.data.category) {
      conditions.push(eq(postsTable.category, params.data.category));
    }
    if (params.data.published !== undefined) {
      conditions.push(eq(postsTable.published, params.data.published));
    }
  }
  const posts = await db
    .select()
    .from(postsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(postsTable.createdAt));
  res.json(posts);
});

router.post("/posts", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreatePostBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [post] = await db.insert(postsTable).values({
    ...parsed.data,
    published: parsed.data.published ?? false,
    featured: parsed.data.featured ?? false,
  }).returning();
  res.status(201).json(post);
});

router.get("/posts/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const [post] = await db.select().from(postsTable).where(eq(postsTable.id, id));
  if (!post) {
    res.status(404).json({ error: "Post not found" });
    return;
  }
  res.json(post);
});

router.patch("/posts/:id", requireAdmin, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const parsed = UpdatePostBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const updates = Object.fromEntries(Object.entries(parsed.data).filter(([, v]) => v !== undefined));
  if (Object.keys(updates).length === 0) {
    res.status(400).json({ error: "No fields to update" });
    return;
  }
  const [post] = await db
    .update(postsTable)
    .set(updates)
    .where(eq(postsTable.id, id))
    .returning();
  if (!post) {
    res.status(404).json({ error: "Post not found" });
    return;
  }
  res.json(post);
});

router.delete("/posts/:id", requireAdmin, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const [post] = await db.delete(postsTable).where(eq(postsTable.id, id)).returning();
  if (!post) {
    res.status(404).json({ error: "Post not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
