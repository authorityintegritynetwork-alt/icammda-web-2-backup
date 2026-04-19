import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, contactMessagesTable } from "@workspace/db";
import { CreateContactMessageBody, UpdateContactMessageBody } from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/requireAdmin";
import { contactFormLimiter } from "../middlewares/rateLimits";
import { sendContactNotification } from "../lib/contactNotifier";

const router: IRouter = Router();

router.post("/contact-messages", contactFormLimiter, async (req, res): Promise<void> => {
  // Honeypot: bots tend to fill every visible/hidden field. Real users leave this blank.
  // Silently respond with success so spammers don't realise they were caught.
  const honeypot = typeof req.body?.website === "string" ? req.body.website.trim() : "";
  if (honeypot.length > 0) {
    req.log.warn({ ip: req.ip }, "Honeypot triggered on contact form — message dropped");
    res.status(201).json({ id: 0, success: true });
    return;
  }

  const parsed = CreateContactMessageBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const { name, email, subject, message } = parsed.data;
  if (name.length > 200 || email.length > 200 || subject.length > 300 || message.length > 5000) {
    res.status(400).json({ error: "One or more fields exceed maximum length." });
    return;
  }
  const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.ip || null;
  const [created] = await db.insert(contactMessagesTable).values({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    subject: subject.trim(),
    message: message.trim(),
    ipAddress: ip,
  }).returning();

  void sendContactNotification({
    id: created.id,
    name: created.name,
    email: created.email,
    subject: created.subject,
    message: created.message,
    createdAt: created.createdAt instanceof Date ? created.createdAt : new Date(created.createdAt),
  });

  res.status(201).json({ id: created.id, success: true });
});

router.get("/contact-messages", requireAdmin, async (_req, res): Promise<void> => {
  const messages = await db
    .select()
    .from(contactMessagesTable)
    .orderBy(desc(contactMessagesTable.createdAt));
  res.json(messages);
});

router.patch("/contact-messages/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const parsed = UpdateContactMessageBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const updates = Object.fromEntries(Object.entries(parsed.data).filter(([, v]) => v !== undefined));
  if (Object.keys(updates).length === 0) { res.status(400).json({ error: "No fields to update" }); return; }
  const [msg] = await db.update(contactMessagesTable).set(updates).where(eq(contactMessagesTable.id, id)).returning();
  if (!msg) { res.status(404).json({ error: "Message not found" }); return; }
  res.json(msg);
});

router.delete("/contact-messages/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const [msg] = await db.delete(contactMessagesTable).where(eq(contactMessagesTable.id, id)).returning();
  if (!msg) { res.status(404).json({ error: "Message not found" }); return; }
  res.sendStatus(204);
});

export default router;
