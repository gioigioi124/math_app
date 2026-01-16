import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      required: true,
    },
    status: {
      type: String,
      enum: ["locked", "available", "completed"],
      default: "locked",
    },
    score: { type: Number, default: 0 },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

export const Progress = mongoose.model("Progress", progressSchema);
