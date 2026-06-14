import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const clientiTable = pgTable("clienti", {
  id: serial("id").primaryKey(),
  nomeAzienda: text("nome_azienda").notNull(),
  referente: text("referente").notNull(),
  email: text("email").notNull(),
  telefono: text("telefono").notNull(),
  settore: text("settore").notNull(),
  indirizzo: text("indirizzo"),
  materialiInteresse: text("materiali_interesse").notNull().default("[]"), // JSON array stored as text
  priorita: text("priorita").notNull().default("media"), // alta, media, bassa
  prossimAzione: text("prossim_azione"),
  note: text("note"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertClienteSchema = createInsertSchema(clientiTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertCliente = z.infer<typeof insertClienteSchema>;
export type Cliente = typeof clientiTable.$inferSelect;
