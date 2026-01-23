import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    grade: { type: Number, required: true, default: 1 },
    description: { type: String },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "easy",
    },
    content: { type: String, required: true },
    engine: { type: String }, // e.g., "addition-v1"
    config: {
      min: { type: Number },
      max: { type: Number },
      total: { type: Number },
    },
    xpReward: { type: Number, default: 10 },
    coinReward: { type: Number, default: 5 },
  },
  { timestamps: true },
);

export const Lesson = mongoose.model("Lesson", lessonSchema);
