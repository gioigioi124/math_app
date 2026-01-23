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

    // Create Lesson 1: Main Lesson with multiple activities
    const lesson1 = await Lesson.create({
      title: "Làm quen với các con số",
      grade: 1,
      description: "Bé học cách nhận biết và cộng các số cơ bản",
      difficulty: "easy",
      content: "Chặng đường đầu tiên khám phá thế giới toán học!",
      xpReward: 30,
      coinReward: 20,
      activities: [
        {
          id: "rec-1-5",
          title: "Nhận biết số từ 1 đến 5",
          description: "Bé hãy đếm các con vật đáng yêu nhé",
          engine: "recognition-v1",
          config: { min: 1, max: 5, total: 3 },
          icon: "🔢",
          color: "#DBEAFE",
        },
        {
          id: "rec-6-10",
          title: "Nhận biết số từ 6 đến 10",
          description: "Cùng đếm các con số lớn hơn nào",
          engine: "recognition-v1",
          config: { min: 6, max: 10, total: 3 },
          icon: "🔢",
          color: "#FEF3C7",
        },
        {
          id: "add-1-5",
          title: "Phép cộng trong phạm vi 5",
          description: "Thử tài làm phép tính cộng đơn giản",
          engine: "addition-v1",
          config: { min: 1, max: 5, total: 5 },
          icon: "➕",
          color: "#FCE7F3",
        },
        {
          id: "match-1-5",
          title: "Nối số với hình ảnh",
          description: "Bé hãy nối số với số lượng hình tương ứng nhé",
          engine: "matching-v1",
          config: { min: 1, max: 5, total: 4 },
          icon: "🔗",
          color: "#E0F2FE",
        },
        {
          id: "comp-1-5",
          title: "So sánh trong phạm vi 5",
          description: "Bé hãy xem bên nào nhiều hơn hoặc ít hơn nhé",
          engine: "comparison-v1",
          config: { min: 1, max: 5, total: 3 },
          icon: "⚖️",
          color: "#FEF2F2",
        },
        {
          id: "comp-6-10",
          title: "So sánh trong phạm vi 10",
          description: "Cùng so sánh các nhóm số lượng lớn hơn nào",
          engine: "comparison-v1",
          config: { min: 6, max: 10, total: 3 },
          icon: "⚖️",
          color: "#F0FDF4",
        },
        {
          id: "order-1-5",
          title: "Thứ tự từ 1 đến 5",
          description: "Sắp xếp các số theo thứ tự tăng dần",
          engine: "ordering-v1",
          config: { min: 1, max: 5 },
          icon: "📈",
          color: "#F5F3FF",
        },
        {
          id: "order-6-10",
          title: "Thứ tự từ 6 đến 10",
          description: "Thử thách sắp xếp các số lớn hơn",
          engine: "ordering-v1",
          config: { min: 6, max: 10 },
          icon: "📈",
          color: "#FFF7ED",
        },
      ],
    });

    console.log("Created Main Lesson:", lesson1.title);
    console.log("Seeding complete!");
    console.log("Seeding complete!");
    process.exit();
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
