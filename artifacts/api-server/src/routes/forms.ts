import { Router, type IRouter, type Request, type Response } from "express";
import { eq, desc, and, count, sql } from "drizzle-orm";
import {
  db,
  formsTable,
  formFieldsTable,
  formSubmissionsTable,
} from "@workspace/db";
import {
  CreateFormBody,
  UpdateFormBody,
  ReplaceFormFieldsBody,
  UpdateFormSubmissionBody,
  SubmitPublicFormBody,
} from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/requireAdmin";

const router: IRouter = Router();

// ───────────────────────────── ADMIN ─────────────────────────────

router.get("/forms", requireAdmin, async (_req: Request, res: Response): Promise<void> => {
  const forms = await db.select().from(formsTable).orderBy(desc(formsTable.createdAt));
  res.json(forms);
});

router.post("/forms", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const parsed = CreateFormBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const insert: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.closeDate) insert.closeDate = new Date(parsed.data.closeDate);
  const [form] = await db.insert(formsTable).values(insert as typeof formsTable.$inferInsert).returning();
  res.status(201).json(form);
});

async function loadFormWithFields(id: number) {
  const [form] = await db.select().from(formsTable).where(eq(formsTable.id, id));
  if (!form) return null;
  const fields = await db
    .select()
    .from(formFieldsTable)
    .where(eq(formFieldsTable.formId, id))
    .orderBy(formFieldsTable.order);
  const [{ value: submissionCount } = { value: 0 }] = await db
    .select({ value: count() })
    .from(formSubmissionsTable)
    .where(eq(formSubmissionsTable.formId, id));
  return { ...form, fields, submissionCount: Number(submissionCount) };
}

router.get("/forms/:id", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(String(req.params.id), 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const form = await loadFormWithFields(id);
  if (!form) { res.status(404).json({ error: "Form not found" }); return; }
  res.json(form);
});

router.patch("/forms/:id", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(String(req.params.id), 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const parsed = UpdateFormBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const update: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.closeDate) update.closeDate = new Date(parsed.data.closeDate);
  const [form] = await db.update(formsTable).set(update as Partial<typeof formsTable.$inferInsert>).where(eq(formsTable.id, id)).returning();
  if (!form) { res.status(404).json({ error: "Form not found" }); return; }
  res.json(form);
});

router.delete("/forms/:id", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(String(req.params.id), 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const [form] = await db.delete(formsTable).where(eq(formsTable.id, id)).returning();
  if (!form) { res.status(404).json({ error: "Form not found" }); return; }
  res.sendStatus(204);
});

router.put("/forms/:id/fields", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(String(req.params.id), 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const parsed = ReplaceFormFieldsBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const [form] = await db.select().from(formsTable).where(eq(formsTable.id, id));
  if (!form) { res.status(404).json({ error: "Form not found" }); return; }

  await db.transaction(async (tx) => {
    await tx.delete(formFieldsTable).where(eq(formFieldsTable.formId, id));
    if (parsed.data.fields.length > 0) {
      const rows = parsed.data.fields.map((f, idx) => ({
        formId: id,
        fieldKey: f.fieldKey,
        type: f.type,
        label: f.label,
        helpText: f.helpText ?? null,
        placeholder: f.placeholder ?? null,
        required: f.required ?? false,
        options: f.options ?? null,
        validation: f.validation ?? null,
        conditional: f.conditional ?? null,
        order: typeof f.order === "number" ? f.order : idx,
      }));
      await tx.insert(formFieldsTable).values(rows);
    }
  });

  const fields = await db.select().from(formFieldsTable).where(eq(formFieldsTable.formId, id)).orderBy(formFieldsTable.order);
  res.json(fields);
});

router.get("/forms/:id/submissions", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(String(req.params.id), 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const submissions = await db.select().from(formSubmissionsTable).where(eq(formSubmissionsTable.formId, id)).orderBy(desc(formSubmissionsTable.createdAt));
  res.json(submissions);
});

router.patch("/forms/submissions/:submissionId", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(String(req.params.submissionId), 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const parsed = UpdateFormSubmissionBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [sub] = await db.update(formSubmissionsTable).set(parsed.data as Partial<typeof formSubmissionsTable.$inferInsert>).where(eq(formSubmissionsTable.id, id)).returning();
  if (!sub) { res.status(404).json({ error: "Submission not found" }); return; }
  res.json(sub);
});

router.delete("/forms/submissions/:submissionId", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(String(req.params.submissionId), 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const [sub] = await db.delete(formSubmissionsTable).where(eq(formSubmissionsTable.id, id)).returning();
  if (!sub) { res.status(404).json({ error: "Submission not found" }); return; }
  res.sendStatus(204);
});

// CSV / XLSX export — kept outside OpenAPI (binary streaming response)
router.get("/forms/:id/export.csv", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(String(req.params.id), 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const fields = await db.select().from(formFieldsTable).where(eq(formFieldsTable.formId, id)).orderBy(formFieldsTable.order);
  const submissions = await db.select().from(formSubmissionsTable).where(eq(formSubmissionsTable.formId, id)).orderBy(desc(formSubmissionsTable.createdAt));
  const headers = ["id", "submittedAt", "status", ...fields.map((f) => f.label), "notes"];
  const rows = submissions.map((s) => {
    const data = (s.data ?? {}) as Record<string, unknown>;
    return [
      s.id,
      s.createdAt.toISOString(),
      s.status,
      ...fields.map((f) => csvCell(data[f.fieldKey])),
      s.notes ?? "",
    ];
  });
  const csv = [headers, ...rows].map((r) => r.map(csvEscape).join(",")).join("\r\n");
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="form-${id}-submissions.csv"`);
  res.send(csv);
});

function csvCell(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (Array.isArray(v)) return v.join("; ");
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}
function csvEscape(v: unknown): string {
  const s = String(v ?? "");
  if (/[",\r\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

// ───────────────────────────── PUBLIC ─────────────────────────────

router.get("/public/events/:eventId/forms", async (req: Request, res: Response): Promise<void> => {
  const eventId = parseInt(String(req.params.eventId), 10);
  if (isNaN(eventId)) { res.status(400).json({ error: "Invalid id" }); return; }
  const rows = await db
    .select({ id: formsTable.id, slug: formsTable.slug, title: formsTable.title, description: formsTable.description })
    .from(formsTable)
    .where(and(eq(formsTable.eventId, eventId), eq(formsTable.status, "published")));
  res.json(rows);
});

// Statuses that consume capacity (pending + approved + checkedin)
const CAPACITY_CONSUMING = ["pending", "approved", "checkedin"] as const;

async function countActive(formId: number): Promise<number> {
  const rows = await db
    .select({ status: formSubmissionsTable.status, c: count() })
    .from(formSubmissionsTable)
    .where(eq(formSubmissionsTable.formId, formId))
    .groupBy(formSubmissionsTable.status);
  return rows
    .filter((r) => (CAPACITY_CONSUMING as readonly string[]).includes(r.status))
    .reduce((acc, r) => acc + Number(r.c), 0);
}

router.get("/public/forms/:slug", async (req: Request, res: Response): Promise<void> => {
  const slug = String(req.params.slug);
  const [form] = await db.select().from(formsTable).where(eq(formsTable.slug, slug));
  if (!form || form.status === "draft") { res.status(404).json({ error: "Form not found" }); return; }
  const fields = await db.select().from(formFieldsTable).where(eq(formFieldsTable.formId, form.id)).orderBy(formFieldsTable.order);
  const totalActive = await countActive(form.id);
  const isFull = form.capacity != null && totalActive >= form.capacity;
  const isClosed = form.status === "closed" || (form.closeDate ? new Date(form.closeDate) < new Date() : false);
  res.json({
    id: form.id,
    title: form.title,
    slug: form.slug,
    description: form.description,
    status: form.status,
    capacity: form.capacity,
    closeDate: form.closeDate,
    waitlistEnabled: form.waitlistEnabled,
    successMessage: form.successMessage,
    isFull,
    isClosed,
    fields,
  });
});

router.post("/public/forms/:slug/submit", async (req: Request, res: Response): Promise<void> => {
  const slug = String(req.params.slug);
  const parsed = SubmitPublicFormBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const [form] = await db.select().from(formsTable).where(eq(formsTable.slug, slug));
  if (!form || form.status === "draft") { res.status(404).json({ error: "Form not found" }); return; }

  if (form.status === "closed" || (form.closeDate && new Date(form.closeDate) < new Date())) {
    res.status(403).json({ error: "Registration is closed" });
    return;
  }

  const fields = await db.select().from(formFieldsTable).where(eq(formFieldsTable.formId, form.id));
  const data = (parsed.data.data ?? {}) as Record<string, unknown>;

  // Server-side required + type validation (respecting conditional)
  for (const f of fields) {
    if (f.type === "section") continue;
    const cond = f.conditional as { fieldKey?: string; equals?: unknown } | null;
    const visible = !cond?.fieldKey || String(data[cond.fieldKey] ?? "") === String(cond.equals ?? "");
    if (!visible) continue;
    const v = data[f.fieldKey];
    if (f.required) {
      if (f.type === "consent") {
        if (v !== true && v !== "true") {
          res.status(400).json({ error: `You must accept: ${f.label}` });
          return;
        }
      } else if (v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0)) {
        res.status(400).json({ error: `Missing required field: ${f.label}` });
        return;
      }
    }
    if (v === undefined || v === null || v === "") continue;
    // Type validation
    if (f.type === "email" && typeof v === "string" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      res.status(400).json({ error: `${f.label}: invalid email` }); return;
    }
    if (f.type === "number" && typeof v !== "number" && isNaN(Number(v))) {
      res.status(400).json({ error: `${f.label}: must be a number` }); return;
    }
    if (f.type === "checkboxes" && !Array.isArray(v)) {
      res.status(400).json({ error: `${f.label}: invalid value` }); return;
    }
    if ((f.type === "select" || f.type === "radio") && f.options) {
      const choices = (f.options as { choices?: string[] }).choices ?? [];
      if (choices.length > 0 && !choices.includes(String(v))) {
        res.status(400).json({ error: `${f.label}: invalid choice` }); return;
      }
    }
  }

  // Best-effort name/email extraction from common keys
  const submitterEmail =
    (typeof data.email === "string" && data.email) ||
    (typeof data.Email === "string" && data.Email) ||
    null;
  const submitterName =
    (typeof data.name === "string" && data.name) ||
    (typeof data.fullName === "string" && data.fullName) ||
    (typeof data.full_name === "string" && data.full_name) ||
    null;

  // Atomic capacity allocation: lock the form row, count, then insert in same tx
  let submission: typeof formSubmissionsTable.$inferSelect | undefined;
  let capacityFull = false;
  try {
    submission = await db.transaction(async (tx) => {
      // Lock the form row to serialize concurrent submissions
      await tx.execute(sql`SELECT id FROM forms WHERE id = ${form.id} FOR UPDATE`);
      let status: "pending" | "waitlisted" = "pending";
      if (form.capacity != null) {
        const rows = await tx
          .select({ status: formSubmissionsTable.status, c: count() })
          .from(formSubmissionsTable)
          .where(eq(formSubmissionsTable.formId, form.id))
          .groupBy(formSubmissionsTable.status);
        const cur = rows
          .filter((r) => (CAPACITY_CONSUMING as readonly string[]).includes(r.status))
          .reduce((acc, r) => acc + Number(r.c), 0);
        if (cur >= form.capacity) {
          if (form.waitlistEnabled) status = "waitlisted";
          else { capacityFull = true; throw new Error("__CAPACITY_FULL__"); }
        }
      }
      const [s] = await tx.insert(formSubmissionsTable).values({
        formId: form.id,
        data,
        status,
        submitterEmail,
        submitterName,
        ipAddress: (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.ip || null,
        userAgent: req.headers["user-agent"] ?? null,
      }).returning();
      return s;
    });
  } catch (e) {
    if (capacityFull) {
      res.status(403).json({ error: "Registration is full" });
      return;
    }
    throw e;
  }
  if (!submission) { res.status(500).json({ error: "Submission failed" }); return; }

  res.status(201).json({
    status: submission.status,
    message: form.successMessage || (submission.status === "waitlisted"
      ? "You've been added to the waitlist — we'll let you know if a spot opens up."
      : "Thank you! Your registration has been received."),
  });
});

export default router;
