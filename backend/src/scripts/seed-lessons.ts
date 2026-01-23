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

    // Create Lesson 1: Recognition (Dynamic)
    const lesson1 = await Lesson.create({
      title: "Nhận biết số từ 1 đến 5",
      grade: 1,
      description: "Học cách nhận biết và đếm số từ 1 đến 5",
      difficulty: "easy",
      content: "Bài học này giúp bé làm quen với các con số cơ bản đầu tiên.",
      engine: "recognition-v1",
      config: {
        min: 1,
        max: 5,
        total: 3,
      },
      xpReward: 10,
      coinReward: 5,
    });

    // Create Lesson 2: Addition (Dynamic)
    const lesson2 = await Lesson.create({
      title: "Phép cộng trong phạm vi 5",
      grade: 1,
      description: "Phép cộng cơ bản trong phạm vi 5",
      difficulty: "easy",
      content: "Bé học cách cộng các số nhỏ hơn 5.",
      engine: "addition-v1",
      config: {
        min: 1,
        max: 5,
        total: 5,
      },
      xpReward: 15,
      coinReward: 10,
    });

    console.log("Created Lessons:", lesson1.title, "and", lesson2.title);
    console.log("Seeding complete!");
    process.exit();
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
