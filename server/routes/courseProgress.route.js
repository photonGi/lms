import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js"
import { getCourseProgress, markAsCompleted, markAsInCompleted, updateLectureProgress } from "../controllers/courseProgress.model.js";

const router = express.Router()

router.route("/:coursId").get(isAuthenticated, getCourseProgress);
router.route("/:courseId/lecture/:lectureId/view").post(isAuthenticated, updateLectureProgress);
router.route("/:courseId/complete").post(isAuthenticated, markAsCompleted);
router.route("/:courseId/complete").post(isAuthenticated, markAsInCompleted);

export default router;
