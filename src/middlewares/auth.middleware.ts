import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

type Role = "STUDENT" | "INSTRUCTOR";


export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ success: false, message: "User is not authenticated." });
        }

        const [type, token] = authHeader?.split(" ");

        if (type !== "Bearer" || !token) {
            return res.status(401).json({ success: false, message: "User is not authenticated." });
        }

        const decodedValue = jwt.verify(token, process.env.JWT_SECRET!) as {
            userId: string,
            role: Role
        };
        
        req.userId = decodedValue.userId;
        req.role = decodedValue.role;

        next();

    } catch (error) {
        return res.status(401).json({ success: false, message: "User is not authenticated." });
    }
}