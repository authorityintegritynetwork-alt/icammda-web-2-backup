import { Router, type IRouter } from "express";
import healthRouter from "./health";
import postsRouter from "./posts";
import eventsRouter from "./events";
import teamRouter from "./team";
import partnersRouter from "./partners";
import statsRouter from "./stats";
import researchRouter from "./research";
import youtubeRouter from "./youtube";
import storageRouter from "./storage";

const router: IRouter = Router();

router.use(healthRouter);
router.use(postsRouter);
router.use(eventsRouter);
router.use(teamRouter);
router.use(partnersRouter);
router.use(statsRouter);
router.use(researchRouter);
router.use(youtubeRouter);
router.use(storageRouter);

export default router;
