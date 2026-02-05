import {z} from "zod";

export const createLessonSchema = z.object({
    title: z.string().min(1,"Title is required"),
    content: z.string().min(1,"Content is required"),
    courseId: z.uuid("Invalid course ID")
});