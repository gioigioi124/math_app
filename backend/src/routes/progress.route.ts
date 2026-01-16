import { Router } from "express";
import {
  getProgress,
  updateProgress,
} from "../controllers/progress.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", protect, getProgress);
router.post("/update", protect, updateProgress);

export default router;
