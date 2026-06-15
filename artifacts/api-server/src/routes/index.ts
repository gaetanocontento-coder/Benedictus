import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import dashboardRouter from "./dashboard";
import leadsRouter from "./leads";
import clientiRouter from "./clienti";
import materialiRouter from "./materiali";
import campioniRouter from "./campioni";
import proposteRouter from "./proposte";
import insightsRouter from "./insights";
import publicRouter from "./public";
import benedictusBRouter from "./benedictus";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/public", publicRouter);
router.use("/auth", authRouter);
router.use("/dashboard", dashboardRouter);
router.use("/leads", leadsRouter);
router.use("/clienti", clientiRouter);
router.use("/materiali", materialiRouter);
router.use("/campioni", campioniRouter);
router.use("/proposte", proposteRouter);
router.use("/insights", insightsRouter);
router.use(benedictusBRouter);

export default router;
