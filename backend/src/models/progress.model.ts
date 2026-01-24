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
    activities: [
      {
        activityId: { type: String, required: true },
        status: {
          type: String,
          enum: ["locked", "not-started", "in-progress", "completed"],
        },
        score: { type: Number },
        accuracy: { type: Number },
        stars: { type: Number, default: 0 },
        completedAt: { type: Date },
      },
    ],
    score: { type: Number, default: 0 }, // average or total score
    stars: { type: Number, default: 0 }, // total stars for this lesson
    completedAt: { type: Date },
  },
  { timestamps: true },
);

export const Progress = mongoose.model("Progress", progressSchema);
