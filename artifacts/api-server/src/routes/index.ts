import { Router, type IRouter } from "express";
import healthRouter from "./health";
import postsRouter from "./posts";
import eventsRouter from "./events";
import teamRouter from "./team";
import partnersRouter from "./partners";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use(postsRouter);
router.use(eventsRouter);
router.use(teamRouter);
router.use(partnersRouter);
router.use(statsRouter);

export default router;
