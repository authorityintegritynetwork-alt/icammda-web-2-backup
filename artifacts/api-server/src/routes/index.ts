import { Router, type IRouter } from "express";
import healthRouter from "./health";
import postsRouter from "./posts";
import eventsRouter from "./events";
import eventSpeakersRouter from "./eventSpeakers";
import contactMessagesRouter from "./contactMessages";
import teamRouter from "./team";
import partnersRouter from "./partners";
import statsRouter from "./stats";
import researchRouter from "./research";
import youtubeRouter from "./youtube";
import storageRouter from "./storage";
import linkedinRouter from "./linkedin";
import contentRouter from "./content";
import sitemapRouter from "./sitemap";
import formsRouter from "./forms";

const router: IRouter = Router();

router.use(healthRouter);
router.use(postsRouter);
router.use(eventsRouter);
router.use(eventSpeakersRouter);
router.use(contactMessagesRouter);
router.use(teamRouter);
router.use(partnersRouter);
router.use(statsRouter);
router.use(researchRouter);
router.use(youtubeRouter);
router.use(storageRouter);
router.use(linkedinRouter);
router.use("/site-content", contentRouter);
router.use(sitemapRouter);
router.use(formsRouter);

export default router;
