import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.model";

export const updateUserGrade = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req as any).user?.id;
    const { grade } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (!grade || grade < 1 || grade > 5) {
      return res.status(400).json({ message: "Invalid grade" });
    }

    const user = await User.findByIdAndUpdate(userId, { grade }, { new: true });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      _id: user._id,
      childName: user.childName,
      phone: user.phone,
      grade: user.grade,
      type: user.type,
    });
  } catch (error) {
    next(error);
  }
};
