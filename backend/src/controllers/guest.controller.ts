import { Request, Response } from "express";
import { User } from "../models/user.model";

// Create a new guest user
export const createGuest = async (req: Request, res: Response) => {
  try {
    const { deviceId, grade } = req.body;

    if (!deviceId) {
      return res.status(400).json({ message: "deviceId is required" });
    }

    if (!grade || grade < 1 || grade > 5) {
      return res.status(400).json({ message: "grade must be between 1 and 5" });
    }

    // Check if guest already exists for this device
    let guest = await User.findOne({ deviceId, type: "guest" });

    if (guest) {
      // Update grade if different
      if (guest.grade !== grade) {
        guest.grade = grade;
        await guest.save();
      }
      return res.json({ user: guest });
    }

    // Create new guest
    guest = await User.create({
      type: "guest",
      deviceId,
      grade,
    });

    res.status(201).json({ user: guest });
  } catch (error) {
    console.error("Create guest error:", error);
    res.status(500).json({ message: "Failed to create guest user" });
  }
};

// Upgrade guest to authenticated user
export const upgradeGuest = async (req: Request, res: Response) => {
  try {
    const { deviceId, childName, phone, password } = req.body;

    if (!deviceId || !childName || !phone || !password) {
      return res.status(400).json({
        message: "deviceId, childName, phone, and password are required",
      });
    }

    // Find guest user
    const guest = await User.findOne({ deviceId, type: "guest" });

    if (!guest) {
      return res.status(404).json({ message: "Guest user not found" });
    }

    // Check if phone already exists
    const existingUser = await User.findOne({
      phone,
      _id: { $ne: guest._id },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Số điện thoại đã được đăng ký",
      });
    }

    // Upgrade to user
    guest.type = "user";
    guest.childName = childName;
    guest.phone = phone;
    guest.password = password;
    await guest.save();

    // Generate JWT token
    const jwt = require("jsonwebtoken");
    const token = jwt.sign(
      { id: guest._id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "30d" },
    );

    res.json({
      message: "Successfully upgraded to user account",
      token,
      _id: guest._id,
      childName: guest.childName,
      phone: guest.phone,
      grade: guest.grade,
      type: guest.type,
      avatar: guest.avatar,
      coins: guest.coins,
      xp: guest.xp,
      level: guest.level,
    });
  } catch (error) {
    console.error("Upgrade guest error:", error);
    res.status(500).json({ message: "Failed to upgrade guest user" });
  }
};

// Get guest by deviceId
export const getGuest = async (req: Request, res: Response) => {
  try {
    const { deviceId } = req.params;

    const guest = await User.findOne({ deviceId });

    if (!guest) {
      return res.status(404).json({ message: "Guest not found" });
    }

    res.json({ user: guest });
  } catch (error) {
    console.error("Get guest error:", error);
    res.status(500).json({ message: "Failed to get guest user" });
  }
};
