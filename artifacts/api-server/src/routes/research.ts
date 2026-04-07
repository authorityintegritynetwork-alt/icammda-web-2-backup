import { Router, type IRouter } from "express";
import { eq, asc } from "drizzle-orm";
import { db, researchGroupsTable, researchMembersTable } from "@workspace/db";
import {
  CreateResearchGroupBody,
  UpdateResearchGroupBody,
  CreateResearchMemberBody,
  UpdateResearchMemberBody,
} from "@workspace/api-zod";
import { requireAuth } from "../middlewares/requireAuth";

const router: IRouter = Router();

// ── Research Groups ──────────────────────────────────────────────────────────

router.get("/research-groups", async (_req, res): Promise<void> => {
  const groups = await db
    .select()
    .from(researchGroupsTable)
    .orderBy(asc(researchGroupsTable.order), asc(researchGroupsTable.createdAt));

  const members = await db
    .select()
    .from(researchMembersTable)
    .orderBy(asc(researchMembersTable.order), asc(researchMembersTable.createdAt));

  const result = groups.map((g) => ({
    ...g,
    members: members.filter((m) => m.groupId === g.id),
  }));

  res.json(result);
});

router.post("/research-groups", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreateResearchGroupBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [group] = await db.insert(researchGroupsTable).values({
    name: parsed.data.name,
    description: parsed.data.description ?? null,
    order: parsed.data.order ?? 0,
  }).returning();
  res.status(201).json({ ...group, members: [] });
});

router.patch("/research-groups/:id", requireAuth, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const parsed = UpdateResearchGroupBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const updates = Object.fromEntries(Object.entries(parsed.data).filter(([, v]) => v !== undefined));
  if (Object.keys(updates).length === 0) { res.status(400).json({ error: "No fields to update" }); return; }
  const [group] = await db.update(researchGroupsTable).set(updates).where(eq(researchGroupsTable.id, id)).returning();
  if (!group) { res.status(404).json({ error: "Research group not found" }); return; }
  res.json(group);
});

router.delete("/research-groups/:id", requireAuth, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const [group] = await db.delete(researchGroupsTable).where(eq(researchGroupsTable.id, id)).returning();
  if (!group) { res.status(404).json({ error: "Research group not found" }); return; }
  res.sendStatus(204);
});

// ── Research Members ─────────────────────────────────────────────────────────

router.get("/research-members", async (req, res): Promise<void> => {
  const visiting = req.query.visiting;
  const members = await db
    .select()
    .from(researchMembersTable)
    .orderBy(asc(researchMembersTable.order), asc(researchMembersTable.createdAt));

  if (visiting === "true") {
    res.json(members.filter((m) => m.groupId === null || m.isVisiting));
  } else {
    res.json(members);
  }
});

router.post("/research-members", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreateResearchMemberBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [member] = await db.insert(researchMembersTable).values({
    groupId: parsed.data.groupId ?? null,
    name: parsed.data.name,
    role: parsed.data.role,
    affiliation: parsed.data.affiliation ?? null,
    email: parsed.data.email ?? null,
    photoUrl: parsed.data.photoUrl ?? null,
    isVisiting: parsed.data.isVisiting ?? false,
    order: parsed.data.order ?? 0,
  }).returning();
  res.status(201).json(member);
});

router.patch("/research-members/:id", requireAuth, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const parsed = UpdateResearchMemberBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const updates = Object.fromEntries(Object.entries(parsed.data).filter(([, v]) => v !== undefined));
  if (Object.keys(updates).length === 0) { res.status(400).json({ error: "No fields to update" }); return; }
  const [member] = await db.update(researchMembersTable).set(updates).where(eq(researchMembersTable.id, id)).returning();
  if (!member) { res.status(404).json({ error: "Research member not found" }); return; }
  res.json(member);
});

router.delete("/research-members/:id", requireAuth, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const [member] = await db.delete(researchMembersTable).where(eq(researchMembersTable.id, id)).returning();
  if (!member) { res.status(404).json({ error: "Research member not found" }); return; }
  res.sendStatus(204);
});

export default router;
