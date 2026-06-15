import { Router, type IRouter, type Request, type Response } from "express";

const router: IRouter = Router();

// Static plans — prices are linked via Stripe price IDs once seeded
// monthlyPrice and annualPrice are in cents
const PLANS = [
  {
    id: "pellegrino",
    name: "Pellegrino",
    tier: "pellegrino",
    description:
      "Il primo passo del cammino. Gratuito, per sempre.",
    features: [
      "Newsletter settimanale",
      "Accesso al podcast Abbas",
      "3 Lectio Humanitatis al mese",
      "Accesso in sola lettura alla comunità",
    ],
    monthlyPriceId: null,
    annualPriceId: null,
    monthlyPrice: null,
    annualPrice: null,
  },
  {
    id: "monaco",
    name: "Monaco",
    tier: "monaco",
    description:
      "Per chi vuole approfondire il cammino e partecipare attivamente alla comunità.",
    features: [
      "Tutto del piano Pellegrino",
      "Archivio Lectio completo",
      "2 masterclass live al mese",
      "Comunità attiva (scrittura + gruppi)",
      "Sessioni di meditazione Celluzza",
      "Biblioteca digitale delle risorse",
    ],
    monthlyPriceId: process.env.STRIPE_MONACO_MONTHLY_PRICE_ID ?? null,
    annualPriceId: process.env.STRIPE_MONACO_ANNUAL_PRICE_ID ?? null,
    monthlyPrice: 1900,
    annualPrice: 18000,
  },
  {
    id: "abbas",
    name: "Abbas",
    tier: "abbas",
    description:
      "Per i custodi più impegnati. Accesso completo al percorso formativo e al coaching.",
    features: [
      "Tutto del piano Monaco",
      "1 sessione di coaching individuale al trimestre",
      "Accesso prioritario agli eventi fisici",
      "Mentorship alumni",
      "Certificazione annuale",
      "Ritiro residenziale annuale incluso",
    ],
    monthlyPriceId: process.env.STRIPE_ABBAS_MONTHLY_PRICE_ID ?? null,
    annualPriceId: process.env.STRIPE_ABBAS_ANNUAL_PRICE_ID ?? null,
    monthlyPrice: 4900,
    annualPrice: 49000,
  },
];

router.get("/plans", async (_req: Request, res: Response): Promise<void> => {
  res.json(PLANS);
});

export default router;
