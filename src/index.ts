import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.route";
import courseRoutes from "./routes/course.route";
import lessonRoutes from "./routes/lesson.route";

const PORT = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
    res.send("Course Selling API");
});

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/lessons", lessonRoutes);

app.listen(PORT, () => {
    console.log(`Server listening on PORT=${PORT}`);
})