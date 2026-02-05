import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { createLesson } from "../controllers/lesson.controller";

const router = Router();

router.post("/",authMiddleware,createLesson);

export default router;