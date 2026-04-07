import { Router, type IRouter } from "express";
import { eq, gte, count } from "drizzle-orm";
import { db, postsTable, eventsTable, teamTable, partnersTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/stats", async (req, res): Promise<void> => {
  const now = new Date();

  const [postsCount] = await db.select({ count: count() }).from(postsTable);
  const [eventsCount] = await db.select({ count: count() }).from(eventsTable);
  const [teamCount] = await db.select({ count: count() }).from(teamTable);
  const [partnersCount] = await db.select({ count: count() }).from(partnersTable);
  const [upcomingCount] = await db
    .select({ count: count() })
    .from(eventsTable)
    .where(gte(eventsTable.startDate, now));
  const [recentCount] = await db
    .select({ count: count() })
    .from(postsTable)
    .where(eq(postsTable.published, true));

  res.json({
    totalPosts: postsCount.count,
    totalEvents: eventsCount.count,
    totalTeamMembers: teamCount.count,
    totalPartners: partnersCount.count,
    upcomingEvents: upcomingCount.count,
    recentPosts: recentCount.count,
  });
});

export default router;
