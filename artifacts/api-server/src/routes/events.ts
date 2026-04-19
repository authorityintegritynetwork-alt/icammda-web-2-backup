import { Router, type IRouter } from "express";
import { eq, desc, and, gte } from "drizzle-orm";
import { db, eventsTable } from "@workspace/db";
import {
  CreateEventBody,
  UpdateEventBody,
  UpdateEventParams,
  GetEventParams,
  DeleteEventParams,
  ListEventsQueryParams,
} from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/requireAdmin";

const router: IRouter = Router();

router.get("/events/upcoming", async (req, res): Promise<void> => {
  const now = new Date();
  const events = await db
    .select()
    .from(eventsTable)
    .where(and(
      eq(eventsTable.published, true),
      gte(eventsTable.startDate, now)
    ))
    .orderBy(eventsTable.startDate)
    .limit(5);
  res.json(events);
});

router.get("/events", async (req, res): Promise<void> => {
  const params = ListEventsQueryParams.safeParse(req.query);
  const conditions = [];
  if (params.success) {
    if (params.data.type) {
      conditions.push(eq(eventsTable.eventType, params.data.type));
    }
    if (params.data.published !== undefined) {
      conditions.push(eq(eventsTable.published, params.data.published));
    }
  }
  const events = await db
    .select()
    .from(eventsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(eventsTable.createdAt));
  res.json(events);
});

router.post("/events", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateEventBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const insertData: Record<string, unknown> = {
    title: parsed.data.title,
    slug: parsed.data.slug,
    description: parsed.data.description,
    eventType: parsed.data.eventType,
    formType: parsed.data.formType,
    location: parsed.data.location ?? null,
    imageUrl: parsed.data.imageUrl ?? null,
    googleFormUrl: parsed.data.googleFormUrl ?? null,
    customFormFields: parsed.data.customFormFields ?? null,
    published: parsed.data.published ?? false,
    featured: parsed.data.featured ?? false,
  };
  if (parsed.data.startDate) insertData.startDate = new Date(parsed.data.startDate);
  if (parsed.data.endDate) insertData.endDate = new Date(parsed.data.endDate);
  const [event] = await db.insert(eventsTable).values(insertData as typeof eventsTable.$inferInsert).returning();
  res.status(201).json(event);
});

router.get("/events/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const [event] = await db.select().from(eventsTable).where(eq(eventsTable.id, id));
  if (!event) {
    res.status(404).json({ error: "Event not found" });
    return;
  }
  res.json(event);
});

router.patch("/events/:id", requireAdmin, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const parsed = UpdateEventBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const updateData: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.startDate) updateData.startDate = new Date(parsed.data.startDate);
  if (parsed.data.endDate) updateData.endDate = new Date(parsed.data.endDate);
  const [event] = await db
    .update(eventsTable)
    .set(updateData as Partial<typeof eventsTable.$inferInsert>)
    .where(eq(eventsTable.id, id))
    .returning();
  if (!event) {
    res.status(404).json({ error: "Event not found" });
    return;
  }
  res.json(event);
});

router.delete("/events/:id", requireAdmin, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const [event] = await db.delete(eventsTable).where(eq(eventsTable.id, id)).returning();
  if (!event) {
    res.status(404).json({ error: "Event not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
