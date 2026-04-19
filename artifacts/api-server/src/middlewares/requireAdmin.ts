import { getAuth, clerkClient } from "@clerk/express";
import type { Request, Response, NextFunction } from "express";
import { logger } from "../lib/logger";

function getAdminEmails(): string[] {
  const raw = process.env["ADMIN_EMAILS"] ?? "";
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export const requireAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const auth = getAuth(req);
  const userId = auth?.userId;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const adminEmails = getAdminEmails();
  if (adminEmails.length === 0) {
    logger.error("ADMIN_EMAILS env var is not configured — denying all admin requests");
    res.status(500).json({ error: "Server misconfiguration: no admin allowlist configured" });
    return;
  }

  try {
    const user = await clerkClient.users.getUser(userId);
    const emails = (user.emailAddresses ?? [])
      .map((e) => e.emailAddress?.toLowerCase())
      .filter(Boolean) as string[];
    const isAdmin = emails.some((e) => adminEmails.includes(e));
    if (!isAdmin) {
      res.status(403).json({ error: "Forbidden: admin access required" });
      return;
    }
    next();
  } catch (err) {
    logger.error({ err, userId }, "Failed to verify admin status");
    res.status(500).json({ error: "Failed to verify admin status" });
  }
};
