import mongoose from "mongoose";
import dotenv from "dotenv";
import { Lesson } from "../models/lesson.model";
import { Question } from "../models/question.model";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../../.env") });

const MONGO_URI = process.env.MONGO_URI || "";

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear existing lessons and questions
    await Lesson.deleteMany({});
    await Question.deleteMany({});

    // Create Lesson 1
    const lesson1 = await Lesson.create({
      title: "Đếm trong phạm vi 10",
      grade: 1,
      description: "Học cách đếm các đồ vật từ 1 đến 10",
      difficulty: "easy",
      content: "Bài học này giúp bé nhận biết và đếm các số trong phạm vi 10.",
      xpReward: 10,
      coinReward: 5,
    });

    console.log("Created Lesson:", lesson1.title);

    // Create a question for Lesson 1
    await Question.create({
      lessonId: lesson1._id,
      text: "Có bao nhiêu con vịt trong hình?",
      answers: ["2", "3", "5", "8"],
      correctIndex: 1, // 3 con vịt
    });

    console.log("Created Question for Lesson 1");

    console.log("Seeding complete!");
    process.exit();
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
