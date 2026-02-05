import {z} from "zod";

export const createPurchaseSchema = z.object({
    courseId: z.uuid("Invalid course ID")
});