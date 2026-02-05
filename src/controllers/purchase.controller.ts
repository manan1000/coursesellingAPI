import { Request, Response } from "express";
import { prisma } from "../db";
import { createPurchaseSchema } from "../schemas/purchase.schema";

export const createPurchase = async (req: Request, res: Response) => {
    try {
        if (req.role !== "STUDENT") {
            return res.status(403).json({
                success: false,
                message: "Only students can purchase courses.",
            });
        }

        const parsed = createPurchaseSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ success: false, errors: parsed.error.issues.map(issue => issue.message) });
        }
        const { courseId } = parsed.data;

        const course = await prisma.course.findUnique({
            where: { id: courseId }
        });

        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found." });
        }

        const alreadyPurchased = await prisma.purchase.findFirst({
            where: {
                userId: req.userId,
                courseId
            }
        });

        if (alreadyPurchased) {
            return res.status(409).json({ success: false, message: "Course already purchased" });
        }
        const purchase = await prisma.purchase.create({
            data: {
                userId: req.userId,
                courseId
            }
        });

        return res.status(201).json({ success: true, purchaseId: purchase.id });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error, failed to purchase course." });
    }
}

export const getPurchasesByUserId = async (req: Request, res: Response) => {
    try {

        const userId = req.params.userId as string;
        if (req.userId !== userId) {
            return res.status(403).json({ success: false, message: "You are not authorized to view purchases" });
        }

        const purchases = await prisma.purchase.findMany({
            where: { userId },
            include: { course: true }
        });

        return res.status(200).json({ success: true, courses: purchases.map(p=>p.course) });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error, failed to get your purchases." });
    }
}