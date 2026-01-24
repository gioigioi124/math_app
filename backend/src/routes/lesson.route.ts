import { Router } from "express";
import {
  getLessons,
  getLesson,
  getLessonQuestions,
} from "../controllers/lesson.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", getLessons);
router.get("/:id", getLesson);
router.get("/:id/questions", getLessonQuestions);

export default router;
