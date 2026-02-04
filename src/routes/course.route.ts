import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { createCourse, getCourse } from "../controllers/course.controller";

const router = Router();

router.post("/",authMiddleware,createCourse);
router.get("/",getCourse);
export default router;