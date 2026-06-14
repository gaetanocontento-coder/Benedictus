import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const leadsTable = pgTable("leads", {
  id: serial("id").primaryKey(),
  nomeAzienda: text("nome_azienda").notNull(),
  referente: text("referente").notNull(),
  email: text("email").notNull(),
  telefono: text("telefono").notNull(),
  fonte: text("fonte").notNull(), // sito, meta_ads, linkedin, fiera, showroom
  interesse: text("interesse").notNull(), // tessuti, pelle, outdoor, contract, custom
  stato: text("stato").notNull().default("nuovo"), // nuovo, contattato, campione_inviato, preventivo_inviato, chiuso, perso
  commercialeAssegnato: text("commerciale_assegnato").notNull(),
  note: text("note"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertLeadSchema = createInsertSchema(leadsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leadsTable.$inferSelect;
