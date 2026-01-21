import { Router } from "express";
import {
  createGuest,
  upgradeGuest,
  getGuest,
} from "../controllers/guest.controller";

const router = Router();

// POST /api/guest - Create guest user
router.post("/", createGuest);

// POST /api/guest/upgrade - Upgrade guest to user
router.post("/upgrade", upgradeGuest);

// GET /api/guest/:deviceId - Get guest by deviceId
router.get("/:deviceId", getGuest);

export default router;
