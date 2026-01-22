import { Router } from "express";
import { updateUserGrade } from "../controllers/user.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

// Protected routes - require authentication
router.put("/grade", protect, updateUserGrade);

export default router;
