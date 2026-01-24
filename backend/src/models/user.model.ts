import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    // Guest or authenticated user
    type: { type: String, enum: ["guest", "user"], default: "guest" },

    // For guest identification
    deviceId: { type: String, sparse: true },

    // Grade level (1-5)
    grade: { type: Number, min: 1, max: 5 },

    // Child's name
    childName: { type: String },

    // Optional for guests, required for users
    username: { type: String, unique: true, sparse: true },
    email: { type: String, unique: true, sparse: true },
    phone: { type: String, unique: true, sparse: true },
    password: { type: String },

    // User profile
    avatar: { type: String, default: "" },
    coins: { type: Number, default: 0 },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    totalStars: { type: Number, default: 0 },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

export const User = mongoose.model("User", userSchema);
