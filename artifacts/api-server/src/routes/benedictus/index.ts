import { Router, type IRouter } from "express";
import authRouter from "./auth";
import newsletterRouter from "./newsletter";
import lectioRouter from "./lectio";
import episodesRouter from "./episodes";
import workshopsRouter from "./workshops";
import contentRouter from "./content";
import plansRouter from "./plans";
import checkoutRouter from "./checkout";
import statsRouter from "./stats";
import adminRouter from "./admin";
import percorsoRouter from "./percorso";
import oblatoRouter from "./oblato";
import liturgiaRouter from "./liturgia";
import guidaSpirituale from "./guida-spirituale";
import padreBenedettoRouter from "./padre-benedetto";
import regolaRouter from "./regola";

const router: IRouter = Router();

router.use("/b/auth", authRouter);
router.use("/b", newsletterRouter);
router.use("/b", lectioRouter);
router.use("/b", episodesRouter);
router.use("/b", workshopsRouter);
router.use("/b", contentRouter);
router.use("/b", plansRouter);
router.use("/b", checkoutRouter);
router.use("/b", statsRouter);
router.use("/b", adminRouter);
router.use("/b", percorsoRouter);
router.use("/b", oblatoRouter);
router.use("/b", liturgiaRouter);
router.use("/b", guidaSpirituale);
router.use("/b", padreBenedettoRouter);
router.use("/b", regolaRouter);

export default router;
