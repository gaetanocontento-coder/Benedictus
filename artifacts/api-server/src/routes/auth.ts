import { Router } from "express";
import { logger } from "../lib/logger";

const router = Router();

const DEMO_USERS = [
  { id: 1, nome: "Marco Bianchi", email: "admin@intessuto.it", ruolo: "admin", username: "admin", password: "admin" },
  { id: 2, nome: "Giulia Rossi", email: "commerciale@intessuto.it", ruolo: "commerciale", username: "commerciale", password: "commerciale" },
  { id: 3, nome: "Luca Ferrari", email: "marketing@intessuto.it", ruolo: "marketing", username: "marketing", password: "marketing" },
];

let sessionUser: (typeof DEMO_USERS)[0] | null = null;

router.post("/login", (req, res) => {
  const { username, password } = req.body as { username: string; password: string };
  const user = DEMO_USERS.find(u => u.username === username && u.password === password);
  if (!user) {
    res.status(401).json({ error: "Credenziali non valide" });
    return;
  }
  sessionUser = user;
  const { username: _u, password: _p, ...safeUser } = user;
  req.log.info({ ruolo: user.ruolo }, "Login successful");
  res.json(safeUser);
});

router.get("/me", (req, res) => {
  if (!sessionUser) {
    const defaultUser = { ...DEMO_USERS[0] };
    const { username: _u, password: _p, ...safeUser } = defaultUser;
    res.json(safeUser);
    return;
  }
  const { username: _u, password: _p, ...safeUser } = sessionUser;
  res.json(safeUser);
});

export default router;
