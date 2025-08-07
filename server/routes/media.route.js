import express from "express";
import upload from "../utils/multer.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { uploadMediaController } from "../controllers/course.controller.js";

const router = express.Router();
router.route("/upload-video").post(isAuthenticated, upload.single("file"), uploadMediaController)

export default router;