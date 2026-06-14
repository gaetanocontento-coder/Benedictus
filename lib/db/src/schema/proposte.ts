import { pgTable, text, serial, timestamp, integer, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const proposteTable = pgTable("proposte", {
  id: serial("id").primaryKey(),
  clienteId: integer("cliente_id").notNull(),
  clienteNome: text("cliente_nome").notNull(),
  items: text("items").notNull().default("[]"), // JSON array of PropostaItem
  totale: numeric("totale", { precision: 12, scale: 2 }).notNull().default("0"),
  stato: text("stato").notNull().default("bozza"), // bozza, inviata, accettata, rifiutata
  note: text("note"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertPropostaSchema = createInsertSchema(proposteTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertProposta = z.infer<typeof insertPropostaSchema>;
export type Proposta = typeof proposteTable.$inferSelect;
