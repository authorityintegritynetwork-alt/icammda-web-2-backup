import { pgTable, text, serial, timestamp, boolean, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { eventsTable } from "./events";

export const formsTable = pgTable("forms", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  status: text("status").notNull().default("draft"),
  eventId: integer("event_id").references(() => eventsTable.id, { onDelete: "set null" }),
  capacity: integer("capacity"),
  closeDate: timestamp("close_date", { withTimezone: true }),
  waitlistEnabled: boolean("waitlist_enabled").notNull().default(false),
  successMessage: text("success_message"),
  confirmationEmailSubject: text("confirmation_email_subject"),
  confirmationEmailBody: text("confirmation_email_body"),
  approvalEmailSubject: text("approval_email_subject"),
  approvalEmailBody: text("approval_email_body"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertFormSchema = createInsertSchema(formsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertForm = z.infer<typeof insertFormSchema>;
export type Form = typeof formsTable.$inferSelect;

export const formFieldsTable = pgTable("form_fields", {
  id: serial("id").primaryKey(),
  formId: integer("form_id").notNull().references(() => formsTable.id, { onDelete: "cascade" }),
  fieldKey: text("field_key").notNull(),
  type: text("type").notNull(),
  label: text("label").notNull(),
  helpText: text("help_text"),
  placeholder: text("placeholder"),
  required: boolean("required").notNull().default(false),
  options: jsonb("options"),
  validation: jsonb("validation"),
  conditional: jsonb("conditional"),
  order: integer("order").notNull().default(0),
});

export type FormField = typeof formFieldsTable.$inferSelect;

export const formSubmissionsTable = pgTable("form_submissions", {
  id: serial("id").primaryKey(),
  formId: integer("form_id").notNull().references(() => formsTable.id, { onDelete: "cascade" }),
  data: jsonb("data").notNull(),
  status: text("status").notNull().default("pending"),
  notes: text("notes"),
  submitterEmail: text("submitter_email"),
  submitterName: text("submitter_name"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export type FormSubmission = typeof formSubmissionsTable.$inferSelect;
