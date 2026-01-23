import { Lesson } from "../models/lesson.model";
import { Question } from "../models/question.model";

export const getAllLessons = async (grade?: number) => {
  const query = grade ? { grade } : {};
  return await Lesson.find(query);
};

export const getLessonById = async (id: string) => {
  return await Lesson.findById(id);
};

const generateQuestions = (engine: string, config: any, lessonId: string) => {
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
        lessonId: lessonId,
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
        lessonId: lessonId,
        text: `Bé hãy đếm xem có bao nhiêu hình nhé!`,
        answers: answers,
        correctIndex: answers.indexOf(result.toString()),
        type: "recognition",
        metadata: { a: result, emoji: randomEmoji },
      });
    }
  } else if (engine === "matching-v1") {
    const { min = 1, max = 5, total = 3 } = config;
    const emojis = ["🍎", "🍬", "⭐", "🦆", "🍓", "🎈"];

    // Generate pairs
    const pairs = [];
    const usedValues = new Set();

    while (pairs.length < total) {
      const val = Math.floor(Math.random() * (max - min + 1)) + min;
      if (!usedValues.has(val)) {
        usedValues.add(val);
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];
        pairs.push({ val, emoji });
      }
    }

    // Prepare left (numbers) and right (images)
    const left = pairs.map((p, idx) => ({ id: `l-${idx}`, val: p.val }));
    const right = pairs.map((p, idx) => ({
      id: `r-${idx}`,
      count: p.val,
      emoji: p.emoji,
    }));

    // Helper shuffle function (Fisher-Yates)
    const shuffle = (array: any[]) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };

    const shuffledLeft = shuffle([...left]);
    const shuffledRight = shuffle([...right]);

    questions.push({
      _id: `dynamic-match-0`,
      lessonId: lessonId,
      text: `Bé hãy nối số với hình tương ứng nhé!`,
      type: "matching",
      metadata: {
        left: shuffledLeft,
        right: shuffledRight,
        pairs: pairs, // For validation in FE
      },
    });
  } else if (engine === "comparison-v1") {
    const { min = 1, max = 10, total = 3 } = config;
    const emojis = ["🍎", "🍬", "⭐", "🦆", "🍓", "🎈"];

    for (let i = 0; i < total; i++) {
      let a = Math.floor(Math.random() * (max - min + 1)) + min;
      let b = Math.floor(Math.random() * (max - min + 1)) + min;
      while (a === b) {
        b = Math.floor(Math.random() * (max - min + 1)) + min;
      }

      const isAskingMore = Math.random() > 0.5;
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];

      const text = isAskingMore
        ? `Bên nào có nhiều ${emoji} hơn?`
        : `Bên nào có ít ${emoji} hơn?`;

      const result = isAskingMore
        ? a > b
          ? "Bên trái"
          : "Bên phải"
        : a < b
          ? "Bên trái"
          : "Bên phải";

      const answers = ["Bên trái", "Bên phải"];

      questions.push({
        _id: `dynamic-comp-${i}`,
        lessonId: lessonId,
        text: text,
        type: "comparison",
        answers: answers,
        correctIndex: answers.indexOf(result),
        metadata: { a, b, emoji, isAskingMore },
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
  if (!lesson) return [];

  // Check if specific activity has its own engine/config
  if (activityId && lesson.activities) {
    const activity = lesson.activities.find((a: any) => a.id === activityId);
    if (activity && activity.engine) {
      return generateQuestions(activity.engine, activity.config, lessonId);
    }
  }

  // Fallback to top-level engine
  if (lesson.engine) {
    return generateQuestions(lesson.engine, lesson.config, lessonId);
  }

  const query: any = { lessonId };
  if (activityId) {
    query.activityId = activityId;
  }
  return await Question.find(query);
};
