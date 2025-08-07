import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/connection.js";
import userRoutes from "./routes/user.route.js";
import courseRoutes from "./routes/course.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import mediaRoute from "./routes/media.route.js"
import purchseRoute from "./routes/purchaseCourse.route.js"
import courseProgressRoute from "./routes/courseProgress.route.js"

dotenv.config({});
const app = express();

const PORT = process.env.PORT || 4000;

connectDB();

// middleware default
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
//apis
app.use("/api/vq/media", mediaRoute)
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/purchase", purchseRoute);
app.use("/api/v1/progress", courseProgressRoute);


app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the server",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
