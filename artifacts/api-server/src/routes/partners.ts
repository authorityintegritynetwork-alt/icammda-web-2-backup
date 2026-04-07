import { Router, type IRouter } from "express";
import { eq, asc } from "drizzle-orm";
import { db, partnersTable } from "@workspace/db";
import {
  CreatePartnerBody,
  UpdatePartnerBody,
  UpdatePartnerParams,
  DeletePartnerParams,
} from "@workspace/api-zod";
import { requireAuth } from "../middlewares/requireAuth";

const router: IRouter = Router();

router.get("/partners", async (req, res): Promise<void> => {
  const partners = await db
    .select()
    .from(partnersTable)
    .orderBy(asc(partnersTable.order), asc(partnersTable.createdAt));
  res.json(partners);
});

router.post("/partners", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreatePartnerBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [partner] = await db.insert(partnersTable).values({
    ...parsed.data,
    order: parsed.data.order ?? 0,
  }).returning();
  res.status(201).json(partner);
});

router.patch("/partners/:id", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const parsed = UpdatePartnerBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [partner] = await db
    .update(partnersTable)
    .set(parsed.data)
    .where(eq(partnersTable.id, id))
    .returning();
  if (!partner) {
    res.status(404).json({ error: "Partner not found" });
    return;
  }
  res.json(partner);
});

router.delete("/partners/:id", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const [partner] = await db.delete(partnersTable).where(eq(partnersTable.id, id)).returning();
  if (!partner) {
    res.status(404).json({ error: "Partner not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
