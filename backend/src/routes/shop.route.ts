import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

// Placeholder routes for shop
router.get("/", protect, (req, res) =>
  res.json({ message: "Shop items route" })
);
router.post("/buy", protect, (req, res) =>
  res.json({ message: "Buy item route" })
);

export default router;
