import { Request, Response } from "express";
import { createLessonSchema } from "../schemas/lesson.schema";
import { prisma } from "../db";

export const createLesson = async (req: Request, res: Response) => {
    try {
        if (req.role !== "INSTRUCTOR") {
            return res.status(403).json({
                success: false,
                message: "Only instructors can add lesson",
            });
        }

        const parsed = createLessonSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ success: false, errors: parsed.error.issues.map(issue => issue.message) });
        }

        const { title, content, courseId } = parsed.data;
        const course = await prisma.course.findUnique({
            where: { id: courseId }
        });

        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found." });
        }

        if (req.userId !== course.instructorId) {
            return res.status(403).json({ success: false, message: "Unauthorized." });
        }

        const lesson = await prisma.lesson.create({
            data: {
                title,
                content,
                courseId
            }
        });

        return res.status(201).json({ success: true, lessonId: lesson.id });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error, failed to create lesson." });
    }
}

