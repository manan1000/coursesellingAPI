import { Request, Response } from "express";
import { prisma } from "../db";
import { createCourseSchema, updateCourseSchema } from "../schemas/course.schema";


export const createCourse = async (req: Request, res: Response) => {

    try {
        if (req.role !== "INSTRUCTOR") {
            return res.status(403).json({ success: false, message: "Only instructors can create a course" });
        }
        const parsed = createCourseSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({ success: false, errors: parsed.error.issues.map(issue => issue.message) });
        }
        const { title, description, price } = parsed.data;

        const course = await prisma.course.create({
            data: {
                title,
                description,
                price,
                instructorId: req.userId
            }
        });

        res.status(201).json({ success: true, message: "Course created successfully.", courseId: course.id });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error, failed to create course." });
    }
}

export const getCourse = async (req: Request, res: Response) => {

    try {

        const courses = await prisma.course.findMany({
            include: { lessons: true }
        });

        return res.status(200).json({ success: true, courses })

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error, failed to fetch courses." });
    }
}

export const getCourseById = async (req: Request, res: Response) => {

    try {

        const courseId = req.params.id as string;
        const course = await prisma.course.findUnique({
            where: { id: courseId },
            include: {
                lessons: true
            }
        });

        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found." });
        }
        return res.status(200).json({ success: true, course });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error, failed to fetch course." });
    }
}

export const updateCourse = async (req: Request, res: Response) => {

    try {

        if (req.role !== "INSTRUCTOR") {
            return res.status(403).json({
                success: false,
                message: "Only instructors can update courses",
            });
        }

        const courseId = req.params.id as string;
        const course = await prisma.course.findUnique({
            where: { id: courseId }
        });

        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found." });
        }
        if (course.instructorId !== req.userId) {
            return res.status(403).json({ success: false, message: "Unauthorized." });
        }

        const parsed = updateCourseSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ success: false, errors: parsed.error.issues.map(issue => issue.message) });
        }
        const { title, description, price } = parsed.data;

        const updatedCourse = await prisma.course.update({
            where: { id: course.id },
            data: {
                title,
                description,
                price
            }
        });

        return res.status(200).json({ success: true, course: updatedCourse })

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error, failed to update course." });
    }
}


export const deleteCourse = async (req: Request, res: Response) => {

    try {

        if (req.role !== "INSTRUCTOR") {
            return res.status(403).json({
                success: false,
                message: "Only instructors can delete courses",
            });
        }

        const courseId = req.params.id as string;
        const course = await prisma.course.findUnique({
            where: { id: courseId }
        });

        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found." });
        }
        if (course.instructorId !== req.userId) {
            return res.status(403).json({ success: false, message: "Unauthorized." });
        }

        await prisma.course.delete({
            where: { id: course.id }
        });

        return res.status(200).json({ success: true, message: "Course deleted successfully" })

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error, failed to delete course." });
    }
}

export const getLessonByCourseId = async (req: Request, res: Response) => {
    try {
        const courseId = req.params.courseId as string;
        const course = await prisma.course.findUnique({
            where: { id: courseId },
            include: { lessons: true }
        });

        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        return res.status(200).json({ success: true, lessons: course.lessons });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error, failed to get lessons." });
    }
}