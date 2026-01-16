import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "easy",
    },
    content: { type: String, required: true },
    xpReward: { type: Number, default: 10 },
    coinReward: { type: Number, default: 5 },
  },
  { timestamps: true }
);

export const Lesson = mongoose.model("Lesson", lessonSchema);
