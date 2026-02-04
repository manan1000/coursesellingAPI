import { Request, Response } from "express";
import { prisma } from "../db";
import { createCourseSchema } from "../schemas/course.schema";


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

        res.status(201).json({ success: true, message: "Course created successfully.", courseId: course.id});

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error, failed to create course." });
    }
}

export const getCourse = async (req: Request, res: Response) => {

    try {

        const courses = await prisma.course.findMany();

        return res.status(200).json({success: true, courses})

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error, failed to fetch courses." });
    }
}