import { Lesson } from "../models/lesson.model";
import { Question } from "../models/question.model";

export const getAllLessons = async (grade?: number) => {
  const query = grade ? { grade } : {};
  return await Lesson.find(query);
};

export const getLessonById = async (id: string) => {
  return await Lesson.findById(id);
};

const generateQuestions = (lesson: any) => {
  const { engine, config } = lesson;
  if (!engine || !config) return [];

  const questions = [];
  const { min = 1, max = 10, total = 5 } = config;

  if (engine === "addition-v1") {
    for (let i = 0; i < total; i++) {
      const a = Math.floor(Math.random() * (max - min + 1)) + min;
      const b = Math.floor(Math.random() * (max - min + 1)) + min;
      const result = a + b;

      // Generate 4 options
      const answers = [result.toString()];
      while (answers.length < 4) {
        const wrong = Math.floor(Math.random() * (max * 2 - min + 1)) + min;
        if (!answers.includes(wrong.toString())) {
          answers.push(wrong.toString());
        }
      }

      // Shuffle answers
      for (let j = answers.length - 1; j > 0; j--) {
        const k = Math.floor(Math.random() * (j + 1));
        [answers[j], answers[k]] = [answers[k], answers[j]];
      }

      const emojis = ["🍎", "🍬", "⭐", "🦆", "✏️", "🍓", "🎈"];
      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

      questions.push({
        _id: `dynamic-${i}`,
        lessonId: lesson._id,
        text: `Phép tính: ${a} + ${b} = ?`,
        answers: answers,
        correctIndex: answers.indexOf(result.toString()),
        type: "addition",
        metadata: { a, b, emoji: randomEmoji },
      });
    }
  } else if (engine === "recognition-v1") {
    for (let i = 0; i < total; i++) {
      const result = Math.floor(Math.random() * (max - min + 1)) + min;

      // Generate 4 options within [min, max] if possible, otherwise beyond
      const answers = [result.toString()];
      const rangeSize = max - min + 1;

      while (answers.length < Math.min(4, rangeSize + 2)) {
        let wrong;
        if (rangeSize >= 4) {
          wrong = Math.floor(Math.random() * (max - min + 1)) + min;
        } else {
          wrong = Math.floor(Math.random() * (max + 2 - min + 1)) + min;
        }

        if (!answers.includes(wrong.toString())) {
          answers.push(wrong.toString());
        }
      }

      // Shuffle answers
      for (let j = answers.length - 1; j > 0; j--) {
        const k = Math.floor(Math.random() * (j + 1));
        [answers[j], answers[k]] = [answers[k], answers[j]];
      }

      const emojis = ["🍎", "🍬", "⭐", "🦆", "✏️", "🍓", "🎈"];
      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

      questions.push({
        _id: `dynamic-rec-${i}`,
        lessonId: lesson._id,
        text: `Bé hãy đếm xem có bao nhiêu hình nhé!`,
        answers: answers,
        correctIndex: answers.indexOf(result.toString()),
        type: "recognition",
        metadata: { a: result, emoji: randomEmoji },
      });
    }
  }

  return questions;
};

export const getQuestionsByLessonId = async (
  lessonId: string,
  activityId?: string,
) => {
  const lesson = await Lesson.findById(lessonId);
  if (lesson && lesson.engine) {
    return generateQuestions(lesson);
  }

  const query: any = { lessonId };
  if (activityId) {
    query.activityId = activityId;
  }
  return await Question.find(query);
};
