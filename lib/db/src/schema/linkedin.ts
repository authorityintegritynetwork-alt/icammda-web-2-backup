import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const linkedinPostsTable = pgTable("linkedin_posts", {
  id: serial("id").primaryKey(),
  postUrl: text("post_url").notNull(),
  embedUrl: text("embed_url").notNull(),
  label: text("label"),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertLinkedinPostSchema = createInsertSchema(linkedinPostsTable).omit({ id: true, createdAt: true });
export type InsertLinkedinPost = z.infer<typeof insertLinkedinPostSchema>;
export type LinkedinPost = typeof linkedinPostsTable.$inferSelect;
