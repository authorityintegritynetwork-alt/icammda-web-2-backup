import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, postsTable, eventsTable } from "@workspace/db";

const SITE_URL = (process.env["SITE_URL"] ?? "https://icammda.org").replace(/\/$/, "");

const STATIC_PAGES: Array<{ path: string; priority: string; changefreq: string }> = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/about", priority: "0.9", changefreq: "monthly" },
  { path: "/research", priority: "0.9", changefreq: "monthly" },
  { path: "/news", priority: "0.9", changefreq: "weekly" },
  { path: "/events", priority: "0.9", changefreq: "weekly" },
  { path: "/e-learning", priority: "0.8", changefreq: "monthly" },
  { path: "/team", priority: "0.8", changefreq: "monthly" },
  { path: "/careers", priority: "0.7", changefreq: "weekly" },
  { path: "/contact", priority: "0.7", changefreq: "yearly" },
];

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function urlEntry(loc: string, lastmod?: string, changefreq?: string, priority?: string): string {
  return [
    "  <url>",
    `    <loc>${escapeXml(loc)}</loc>`,
    lastmod ? `    <lastmod>${escapeXml(lastmod)}</lastmod>` : "",
    changefreq ? `    <changefreq>${escapeXml(changefreq)}</changefreq>` : "",
    priority ? `    <priority>${escapeXml(priority)}</priority>` : "",
    "  </url>",
  ].filter(Boolean).join("\n");
}

const router: IRouter = Router();

router.get("/sitemap.xml", async (_req, res): Promise<void> => {
  try {
    const [posts, events] = await Promise.all([
      db.select({ slug: postsTable.slug, updatedAt: postsTable.updatedAt, createdAt: postsTable.createdAt })
        .from(postsTable)
        .where(eq(postsTable.published, true))
        .orderBy(desc(postsTable.createdAt))
        .limit(2000),
      db.select({ slug: eventsTable.slug, updatedAt: eventsTable.updatedAt, createdAt: eventsTable.createdAt })
        .from(eventsTable)
        .where(eq(eventsTable.published, true))
        .orderBy(desc(eventsTable.createdAt))
        .limit(2000),
    ]);

    const entries: string[] = [];

    for (const p of STATIC_PAGES) {
      entries.push(urlEntry(`${SITE_URL}${p.path}`, undefined, p.changefreq, p.priority));
    }

    for (const post of posts) {
      const lastmod = (post.updatedAt ?? post.createdAt) instanceof Date
        ? (post.updatedAt ?? post.createdAt).toISOString()
        : new Date(post.updatedAt ?? post.createdAt).toISOString();
      entries.push(urlEntry(`${SITE_URL}/news/${post.slug}`, lastmod, "monthly", "0.7"));
    }

    for (const ev of events) {
      const lastmod = (ev.updatedAt ?? ev.createdAt) instanceof Date
        ? (ev.updatedAt ?? ev.createdAt).toISOString()
        : new Date(ev.updatedAt ?? ev.createdAt).toISOString();
      entries.push(urlEntry(`${SITE_URL}/events/${ev.slug}`, lastmod, "monthly", "0.7"));
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>\n`;

    res.set("Content-Type", "application/xml; charset=utf-8");
    res.set("Cache-Control", "public, max-age=3600");
    res.send(xml);
  } catch (err) {
    res.status(500).send(`<!-- sitemap generation failed: ${(err as Error).message} -->`);
  }
});

export default router;
