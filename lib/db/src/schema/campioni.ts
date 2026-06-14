import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const campioniTable = pgTable("campioni", {
  id: serial("id").primaryKey(),
  clienteId: integer("cliente_id").notNull(),
  clienteNome: text("cliente_nome").notNull(),
  materialeId: integer("materiale_id").notNull(),
  materialeNome: text("materiale_nome").notNull(),
  dataRichiesta: text("data_richiesta").notNull(), // YYYY-MM-DD
  statoSpedizione: text("stato_spedizione").notNull().default("in_attesa"), // in_attesa, preparazione, spedito, consegnato
  note: text("note"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertCampioneSchema = createInsertSchema(campioniTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertCampione = z.infer<typeof insertCampioneSchema>;
export type Campione = typeof campioniTable.$inferSelect;
