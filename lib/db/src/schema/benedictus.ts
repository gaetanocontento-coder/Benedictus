import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const bUsersTable = pgTable("b_users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  tier: text("tier").notNull().default("pellegrino"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  isAdmin: boolean("is_admin").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertBUserSchema = createInsertSchema(bUsersTable).omit({
  id: true,
  createdAt: true,
});
export type InsertBUser = z.infer<typeof insertBUserSchema>;
export type BUser = typeof bUsersTable.$inferSelect;

export const bNewsletterSubscribersTable = pgTable("b_newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  whyHere: text("why_here"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertBNewsletterSubscriberSchema = createInsertSchema(
  bNewsletterSubscribersTable
).omit({ id: true, createdAt: true });
export type InsertBNewsletterSubscriber = z.infer<
  typeof insertBNewsletterSubscriberSchema
>;
export type BNewsletterSubscriber =
  typeof bNewsletterSubscribersTable.$inferSelect;

export const bLectioTable = pgTable("b_lectio", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  body: text("body").notNull(),
  category: text("category").notNull(),
  publishedAt: timestamp("published_at", { withTimezone: true }).notNull().defaultNow(),
  requiredTier: text("required_tier").notNull().default("pellegrino"),
  readingMinutes: integer("reading_minutes").notNull().default(5),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertBLectioSchema = createInsertSchema(bLectioTable).omit({
  id: true,
  createdAt: true,
});
export type InsertBLectio = z.infer<typeof insertBLectioSchema>;
export type BLectio = typeof bLectioTable.$inferSelect;

export const bEpisodesTable = pgTable("b_episodes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  embedUrl: text("embed_url").notNull(),
  publishedAt: timestamp("published_at", { withTimezone: true }).notNull().defaultNow(),
  durationMinutes: integer("duration_minutes").notNull().default(45),
  isFeatured: boolean("is_featured").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertBEpisodeSchema = createInsertSchema(bEpisodesTable).omit({
  id: true,
  createdAt: true,
});
export type InsertBEpisode = z.infer<typeof insertBEpisodeSchema>;
export type BEpisode = typeof bEpisodesTable.$inferSelect;

export const bWorkshopsTable = pgTable("b_workshops", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: text("date").notNull(),
  location: text("location").notNull(),
  maxParticipants: integer("max_participants").notNull().default(30),
  currentParticipants: integer("current_participants").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertBWorkshopSchema = createInsertSchema(bWorkshopsTable).omit({
  id: true,
  createdAt: true,
});
export type InsertBWorkshop = z.infer<typeof insertBWorkshopSchema>;
export type BWorkshop = typeof bWorkshopsTable.$inferSelect;

export const bWorkshopRegistrationsTable = pgTable(
  "b_workshop_registrations",
  {
    id: serial("id").primaryKey(),
    workshopId: integer("workshop_id").notNull(),
    userId: integer("user_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  }
);

export const bTestimonialsTable = pgTable("b_testimonials", {
  id: serial("id").primaryKey(),
  quote: text("quote").notNull(),
  authorName: text("author_name").notNull(),
  authorRole: text("author_role").notNull(),
  photo: text("photo"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertBTestimonialSchema = createInsertSchema(
  bTestimonialsTable
).omit({ id: true, createdAt: true });
export type InsertBTestimonial = z.infer<typeof insertBTestimonialSchema>;
export type BTestimonial = typeof bTestimonialsTable.$inferSelect;

export const bGraduatesTable = pgTable("b_graduates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  votoDate: text("voto_date").notNull(),
  message: text("message"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const bModuleProgressTable = pgTable(
  "b_module_progress",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull(),
    moduleId: integer("module_id").notNull(),
    startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
  },
  (table) => [uniqueIndex("b_module_progress_user_module_idx").on(table.userId, table.moduleId)]
);

export type BModuleProgress = typeof bModuleProgressTable.$inferSelect;

export const insertBGraduateSchema = createInsertSchema(bGraduatesTable).omit({
  id: true,
  createdAt: true,
});
export type InsertBGraduate = z.infer<typeof insertBGraduateSchema>;
export type BGraduate = typeof bGraduatesTable.$inferSelect;
