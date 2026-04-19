import { Router, type IRouter } from "express";
import { eq, asc } from "drizzle-orm";
import { db, eventSpeakersTable } from "@workspace/db";
import { CreateEventSpeakerBody, UpdateEventSpeakerBody } from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/requireAdmin";

const router: IRouter = Router();

router.get("/event-speakers", async (req, res): Promise<void> => {
  const eventIdRaw = req.query.eventId;
  if (typeof eventIdRaw !== "string") {
    res.status(400).json({ error: "eventId query parameter is required" });
    return;
  }
  const eventId = parseInt(eventIdRaw, 10);
  if (isNaN(eventId)) {
    res.status(400).json({ error: "eventId must be a valid integer" });
    return;
  }
  const speakers = await db
    .select()
    .from(eventSpeakersTable)
    .where(eq(eventSpeakersTable.eventId, eventId))
    .orderBy(asc(eventSpeakersTable.displayOrder), asc(eventSpeakersTable.createdAt));
  res.json(speakers);
});

router.post("/event-speakers", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateEventSpeakerBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [speaker] = await db.insert(eventSpeakersTable).values({
    eventId: parsed.data.eventId,
    name: parsed.data.name,
    title: parsed.data.title ?? null,
    affiliation: parsed.data.affiliation ?? null,
    bio: parsed.data.bio ?? null,
    photoUrl: parsed.data.photoUrl ?? null,
    linkedinUrl: parsed.data.linkedinUrl ?? null,
    websiteUrl: parsed.data.websiteUrl ?? null,
    email: parsed.data.email ?? null,
    speakerType: parsed.data.speakerType ?? "Speaker",
    displayOrder: parsed.data.displayOrder ?? 0,
  }).returning();
  res.status(201).json(speaker);
});

router.patch("/event-speakers/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const parsed = UpdateEventSpeakerBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const updates = Object.fromEntries(Object.entries(parsed.data).filter(([, v]) => v !== undefined));
  if (Object.keys(updates).length === 0) { res.status(400).json({ error: "No fields to update" }); return; }
  const [speaker] = await db.update(eventSpeakersTable).set(updates).where(eq(eventSpeakersTable.id, id)).returning();
  if (!speaker) { res.status(404).json({ error: "Speaker not found" }); return; }
  res.json(speaker);
});

router.delete("/event-speakers/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const [speaker] = await db.delete(eventSpeakersTable).where(eq(eventSpeakersTable.id, id)).returning();
  if (!speaker) { res.status(404).json({ error: "Speaker not found" }); return; }
  res.sendStatus(204);
});

export default router;
