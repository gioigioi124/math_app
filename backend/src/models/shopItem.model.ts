import mongoose from "mongoose";

const shopItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    type: {
      type: String,
      enum: ["avatar", "powerup", "badge"],
      default: "avatar",
    },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

export const ShopItem = mongoose.model("ShopItem", shopItemSchema);
