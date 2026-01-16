import { Router } from "express";
import { getLessons, getLesson } from "../controllers/lesson.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", protect, getLessons);
router.get("/:id", protect, getLesson);

export default router;
