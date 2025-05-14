import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  hourlyRate: integer("hourly_rate"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
  hourlyRate: true,
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  client: text("client"),
  color: text("color").notNull().default("#0ea5e9"),
  isActive: boolean("is_active").notNull().default(true),
});

export const insertProjectSchema = createInsertSchema(projects).pick({
  name: true,
  description: true,
  client: true,
  color: true,
  isActive: true,
});

export const timeEntries = pgTable("time_entries", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  userId: integer("user_id").notNull(),
  task: text("task").notNull(),
  date: timestamp("date").notNull(),
  duration: integer("duration").notNull(), // Duration in minutes
  notes: text("notes"),
  isBillable: boolean("is_billable").notNull().default(true),
});

export const insertTimeEntrySchema = createInsertSchema(timeEntries).pick({
  projectId: true,
  userId: true,
  task: true,
  date: true,
  duration: true,
  notes: true,
  isBillable: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export type TimeEntry = typeof timeEntries.$inferSelect;
export type InsertTimeEntry = z.infer<typeof insertTimeEntrySchema>;

// Extended schemas for validation
export const timeEntryFormSchema = insertTimeEntrySchema.extend({
  hours: z.number().min(0).max(24),
  minutes: z.number().min(0).max(59),
});

export type TimeEntryFormData = z.infer<typeof timeEntryFormSchema>;
