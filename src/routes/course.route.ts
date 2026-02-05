import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { createCourse, deleteCourse, getCourse, getCourseById, getLessonByCourseId, updateCourse } from "../controllers/course.controller";

const router = Router();

router.post("/", authMiddleware, createCourse);
router.get("/", getCourse);
router.get("/:id", getCourseById);
router.patch("/:id", authMiddleware, updateCourse);
router.delete("/:id", authMiddleware, deleteCourse);
router.get("/:courseId/lessons", getLessonByCourseId);

export default router;