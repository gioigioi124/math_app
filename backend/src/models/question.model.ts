import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      required: true,
    },
    text: { type: String, required: true },
    answers: [{ type: String, required: true }],
    correctIndex: { type: Number, required: true },
  },
  { timestamps: true },
);

export const Question = mongoose.model("Question", questionSchema);
