import mongoose from "mongoose";

const leaderboardSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rank: { type: Number },
    totalXp: { type: Number, default: 0 },
    period: {
      type: String,
      enum: ["weekly", "monthly", "alltime"],
      default: "weekly",
    },
  },
  { timestamps: true }
);

export const Leaderboard = mongoose.model("Leaderboard", leaderboardSchema);
