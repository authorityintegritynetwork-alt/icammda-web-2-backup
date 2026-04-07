import { pgTable, text, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";

export const researchGroupsTable = pgTable("research_groups", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const researchMembersTable = pgTable("research_members", {
  id: serial("id").primaryKey(),
  groupId: integer("group_id").references(() => researchGroupsTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  role: text("role").notNull(),
  affiliation: text("affiliation"),
  email: text("email"),
  photoUrl: text("photo_url"),
  isVisiting: boolean("is_visiting").notNull().default(false),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export type ResearchGroup = typeof researchGroupsTable.$inferSelect;
export type ResearchMember = typeof researchMembersTable.$inferSelect;
