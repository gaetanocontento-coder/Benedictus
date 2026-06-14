import { pgTable, text, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const materialiTable = pgTable("materiali", {
  id: serial("id").primaryKey(),
  nome: text("nome").notNull(),
  categoria: text("categoria").notNull(),
  colore: text("colore").notNull(),
  utilizzoConsigliato: text("utilizzo_consigliato").notNull(),
  fasciaPrezzo: text("fascia_prezzo").notNull(),
  disponibile: boolean("disponibile").notNull().default(true),
  descrizione: text("descrizione"),
  richieste: integer("richieste").notNull().default(0),
  tecnologie: text("tecnologie").notNull().default("[]"),     // JSON array: ["aquaclean","ignifugo",...]
  certificazioni: text("certificazioni").notNull().default("[]"), // JSON array: ["GRS","SAFE-FRONT",...]
  stagione: text("stagione"),          // es. "AI 2025-26"
  collezione: text("collezione"),      // es. "GreenFabrics"
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertMaterialeSchema = createInsertSchema(materialiTable).omit({ id: true, createdAt: true, updatedAt: true, richieste: true });
export type InsertMateriale = z.infer<typeof insertMaterialeSchema>;
export type Materiale = typeof materialiTable.$inferSelect;
