import { Request, Response } from "express";
import { prisma } from "../db";
import { signupSchema, loginSchema } from "../schemas/auth.schema";
import jwt from "jsonwebtoken";

export const signup = async (req: Request, res: Response) => {

    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ success: false, errors: parsed.error.issues.map(issue => issue.message) });
    }
    const { name, email, password } = parsed.data;

    try {

        const userAlreadyExists = await prisma.user.findUnique({
            where: { email }
        });

        if (userAlreadyExists) {
            return res.status(409).json({ success: false, message: "User with this email already exists!" });
        }

        const hashedPassword = await Bun.password.hash(password);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });

        return res.status(201).json({ success: true, message: "User created successfully." });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error, failed to create user." });
    }
};

export const login = async (req: Request, res: Response) => {
    try {

        const parsed = loginSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ success: false, errors: parsed.error.issues.map(issue => issue.message) });
        }
        const { email, password } = parsed.data;

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid email or password." });
        }

        const isValidPassword = await Bun.password.verify(password, user.password);

        if (!isValidPassword) {
            return res.status(400).json({ success: false, message: "Invalid email or password." });
        }


        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: "7d" }
        );

        return res.status(200).json({ success: true, message: "User logged in successfully.", token });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error, failed to login." });
    }
};
