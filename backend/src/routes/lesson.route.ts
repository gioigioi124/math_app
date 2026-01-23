import { Router } from "express";
import {
  getLessons,
  getLesson,
  getLessonQuestions,
} from "../controllers/lesson.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", protect, getLessons);
router.get("/:id", protect, getLesson);
router.get("/:id/questions", protect, getLessonQuestions);

export default router;
