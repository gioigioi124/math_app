import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

// Placeholder routes for leaderboard
router.get("/", protect, (req, res) =>
  res.json({ message: "Leaderboard route" })
);

export default router;
