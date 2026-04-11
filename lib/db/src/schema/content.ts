import { pgTable, serial, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";

export const siteContent = pgTable("site_content", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 255 }).notNull().unique(),
  label: varchar("label", { length: 255 }).notNull(),
  value: text("value").notNull().default(""),
  page: varchar("page", { length: 100 }).notNull(),
  type: varchar("type", { length: 50 }).notNull().default("text"),
  sortOrder: integer("sort_order").notNull().default(0),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
