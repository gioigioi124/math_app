import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Question types (for future use)
// interface Question {
//   id: string;
//   type: "counting" | "multiple-choice" | "number-line" | "matching";
//   question: string;
//   highlightWord?: string;
//   image?: string;
//   items?: any[];
//   options?: number[];
//   correctAnswer: number | string;
//   explanation?: string;
// }

// Activity data structure
const activityData: any = {
  "intro-1-5": {
    title: "Introduction to 1-5",
    level: "LEVEL 1 • NUMBERS",
    totalSteps: 10,
    questions: [
      {
        id: "q1",
        type: "counting",
        question: "How many apples are there?",
        highlightWord: "apples",
        items: [
          { id: 1, emoji: "🍎", size: 80 },
          { id: 2, emoji: "🍎", size: 70 },
          { id: 3, emoji: "🍎", size: 80 },
        ],
        options: [1, 2, 3, 4],
        correctAnswer: 3,
        explanation: "Great job! There are 3 apples! 🎉",
      },
      {
        id: "q2",
        type: "counting",
        question: "Count the stars!",
        highlightWord: "stars",
        items: [
          { id: 1, emoji: "⭐", size: 60 },
          { id: 2, emoji: "⭐", size: 70 },
          { id: 3, emoji: "⭐", size: 65 },
          { id: 4, emoji: "⭐", size: 60 },
          { id: 5, emoji: "⭐", size: 70 },
        ],
        options: [3, 4, 5, 6],
        correctAnswer: 5,
        explanation: "Excellent! You counted 5 stars! ⭐",
      },
      {
        id: "q3",
        type: "counting",
        question: "How many balloons do you see?",
        highlightWord: "balloons",
        items: [
          { id: 1, emoji: "🎈", size: 75 },
          { id: 2, emoji: "🎈", size: 70 },
        ],
        options: [1, 2, 3, 4],
        correctAnswer: 2,
        explanation: "Perfect! There are 2 balloons! 🎈",
      },
      {
        id: "q4",
        type: "counting",
        question: "Count all the flowers!",
        highlightWord: "flowers",
        items: [
          { id: 1, emoji: "🌸", size: 65 },
          { id: 2, emoji: "🌸", size: 70 },
          { id: 3, emoji: "🌸", size: 65 },
          { id: 4, emoji: "🌸", size: 70 },
        ],
        options: [2, 3, 4, 5],
        correctAnswer: 4,
        explanation: "Amazing! You found 4 flowers! 🌸",
      },
      {
        id: "q5",
        type: "counting",
        question: "How many hearts are there?",
        highlightWord: "hearts",
        items: [{ id: 1, emoji: "❤️", size: 80 }],
        options: [1, 2, 3, 4],
        correctAnswer: 1,
        explanation: "Wonderful! There is 1 heart! ❤️",
      },
    ],
  },
  "counting-practice": {
    title: "Counting Practice",
    level: "LEVEL 1 • NUMBERS",
    totalSteps: 10,
    questions: [
      {
        id: "q1",
        type: "counting",
        question: "How many cars are there?",
        highlightWord: "cars",
        items: [
          { id: 1, emoji: "🚗", size: 70 },
          { id: 2, emoji: "🚗", size: 75 },
          { id: 3, emoji: "🚗", size: 70 },
        ],
        options: [2, 3, 4, 5],
        correctAnswer: 3,
        explanation: "Great! You counted 3 cars! 🚗",
      },
      {
        id: "q2",
        type: "counting",
        question: "Count the butterflies!",
        highlightWord: "butterflies",
        items: [
          { id: 1, emoji: "🦋", size: 65 },
          { id: 2, emoji: "🦋", size: 70 },
          { id: 3, emoji: "🦋", size: 65 },
          { id: 4, emoji: "🦋", size: 70 },
          { id: 5, emoji: "🦋", size: 65 },
        ],
        options: [3, 4, 5, 6],
        correctAnswer: 5,
        explanation: "Excellent! There are 5 butterflies! 🦋",
      },
    ],
  },
};

export default function ActivityContentScreen() {
  const params = useLocalSearchParams();
  const activityId = params.activityId as string;

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scaleAnim] = useState(new Animated.Value(1));
  const [shakeAnim] = useState(new Animated.Value(0));

  const activity = activityData[activityId] || activityData["intro-1-5"];
  const currentQuestion = activity.questions[currentStep];

  useEffect(() => {
    const newProgress = ((currentStep + 1) / activity.totalSteps) * 100;
    setProgress(newProgress);
  }, [currentStep, activity.totalSteps]);

  const handleAnswerSelect = (answer: number) => {
    if (isCorrect !== null) return; // Already answered

    setSelectedAnswer(answer);

    // Scale animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleCheckAnswer = () => {
    if (selectedAnswer === null) return;

    const correct = selectedAnswer === currentQuestion.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      setShowExplanation(true);
      // Success animation
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Shake animation for wrong answer
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const handleNext = () => {
    if (currentStep < activity.questions.length - 1) {
      setCurrentStep(currentStep + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setShowExplanation(false);
    } else {
      // Activity completed
      handleActivityComplete();
    }
  };

  const handleActivityComplete = async () => {
    try {
      // Save progress
      await AsyncStorage.setItem(
        `activity_${activityId}_completed`,
        JSON.stringify({ completed: true, date: new Date().toISOString() }),
      );
      // Navigate back with success
      router.back();
    } catch (error) {
      console.error("Error saving activity progress:", error);
    }
  };

  const handleSkip = () => {
    setSelectedAnswer(currentQuestion.correctAnswer);
    setIsCorrect(true);
    setShowExplanation(true);
  };

  const renderQuestion = () => {
    const words = currentQuestion.question.split(" ");
    return (
      <Text className="text-white text-2xl font-bold text-center mb-6">
        {words.map((word: string, index: number) => {
          const cleanWord = word.replace(/[?!.,]/g, "");
          const isHighlight =
            currentQuestion.highlightWord &&
            cleanWord.toLowerCase() ===
              currentQuestion.highlightWord.toLowerCase();
          const punctuation = word.match(/[?!.,]/g);

          return (
            <Text key={index}>
              {isHighlight ? (
                <Text className="text-pink-400">{cleanWord}</Text>
              ) : (
                cleanWord
              )}
              {punctuation && punctuation[0]}
              {index < words.length - 1 ? " " : ""}
            </Text>
          );
        })}
      </Text>
    );
  };

  const renderItems = () => {
    if (!currentQuestion.items) return null;

    return (
      <View
        className="bg-gray-800 rounded-3xl p-8 mb-6 items-center justify-center"
        style={{
          minHeight: 280,
          borderWidth: 3,
          borderColor: "#374151",
          borderStyle: "dashed",
        }}
      >
        <View className="flex-row flex-wrap justify-center items-center">
          {currentQuestion.items.map((item: any, index: number) => (
            <Animated.View
              key={item.id}
              style={{
                transform: [
                  {
                    scale: scaleAnim.interpolate({
                      inputRange: [0.95, 1, 1.05],
                      outputRange: [0.95, 1, 1.05],
                    }),
                  },
                ],
              }}
              className="m-2"
            >
              <Text style={{ fontSize: item.size }}>{item.emoji}</Text>
            </Animated.View>
          ))}
        </View>
      </View>
    );
  };

  const renderOptions = () => {
    if (!currentQuestion.options) return null;

    return (
      <View className="flex-row flex-wrap justify-center mb-6">
        {currentQuestion.options.map((option: number) => {
          const isSelected = selectedAnswer === option;
          const isCorrectAnswer = option === currentQuestion.correctAnswer;
          const showCorrect = isCorrect !== null && isCorrectAnswer;
          const showWrong = isCorrect === false && isSelected;

          return (
            <Animated.View
              key={option}
              style={{
                transform: [
                  {
                    translateX:
                      showWrong && isSelected
                        ? shakeAnim
                        : new Animated.Value(0),
                  },
                ],
              }}
              className="w-[45%] m-2"
            >
              <TouchableOpacity
                onPress={() => handleAnswerSelect(option)}
                disabled={isCorrect !== null}
                activeOpacity={0.8}
                className="rounded-3xl py-6 items-center justify-center"
                style={{
                  backgroundColor: showCorrect
                    ? "#10B981"
                    : showWrong
                      ? "#EF4444"
                      : isSelected
                        ? "#10B981"
                        : "#1E293B",
                  borderWidth: 3,
                  borderColor: showCorrect
                    ? "#059669"
                    : showWrong
                      ? "#DC2626"
                      : isSelected
                        ? "#059669"
                        : "#334155",
                }}
              >
                <Text
                  className="text-4xl font-bold"
                  style={{
                    color: isSelected || showCorrect ? "#FFF" : "#94A3B8",
                  }}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-900">
      {/* Header */}
      <View className="pt-14 pb-4 px-6">
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-12 h-12 bg-gray-800 rounded-full items-center justify-center"
          >
            <Feather name="x" size={24} color="#FFF" />
          </TouchableOpacity>

          <View className="flex-1 mx-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-gray-400 text-xs font-bold">
                Step {currentStep + 1} of {activity.totalSteps}
              </Text>
              <View className="flex-row">
                {[1, 2, 3].map((dot) => (
                  <View
                    key={dot}
                    className="w-2 h-2 rounded-full bg-gray-600 mx-1"
                  />
                ))}
              </View>
            </View>
            <View className="bg-gray-800 rounded-full h-2 overflow-hidden">
              <View
                className="bg-teal-500 h-full rounded-full"
                style={{ width: `${progress}%` }}
              />
            </View>
          </View>

          <TouchableOpacity className="w-12 h-12 bg-teal-500 rounded-full items-center justify-center">
            <Feather name="star" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        <Text className="text-teal-400 text-xs font-bold text-center mb-1">
          {activity.level}
        </Text>
        <Text className="text-white text-lg font-bold text-center">
          {activity.title}
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
      >
        {/* Question */}
        <View className="mb-6">{renderQuestion()}</View>

        {/* Items to count */}
        {renderItems()}

        {/* Options */}
        {renderOptions()}

        {/* Explanation */}
        {showExplanation && (
          <Animated.View
            style={{
              transform: [{ scale: scaleAnim }],
            }}
            className="bg-green-500 rounded-3xl p-6 mb-6"
          >
            <View className="flex-row items-center mb-2">
              <Feather name="check-circle" size={24} color="#FFF" />
              <Text className="text-white text-lg font-bold ml-3">
                Correct!
              </Text>
            </View>
            <Text className="text-white text-base">
              {currentQuestion.explanation}
            </Text>
          </Animated.View>
        )}

        {/* Action Buttons */}
        {!showExplanation ? (
          <View>
            <TouchableOpacity
              onPress={handleCheckAnswer}
              disabled={selectedAnswer === null}
              activeOpacity={0.8}
              className="rounded-full py-5 mb-4"
              style={{
                backgroundColor:
                  selectedAnswer !== null ? "#10B981" : "#374151",
              }}
            >
              <View className="flex-row items-center justify-center">
                <Text className="text-white text-lg font-bold mr-2">
                  CHECK ANSWER
                </Text>
                <Feather name="arrow-right" size={20} color="#FFF" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSkip}
              activeOpacity={0.7}
              className="py-4"
            >
              <Text className="text-gray-400 text-base font-semibold text-center">
                I DON&apos;T KNOW YET
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={handleNext}
            activeOpacity={0.8}
            className="bg-teal-500 rounded-full py-5"
          >
            <View className="flex-row items-center justify-center">
              <Text className="text-white text-lg font-bold mr-2">
                {currentStep < activity.questions.length - 1
                  ? "NEXT QUESTION"
                  : "FINISH"}
              </Text>
              <Feather
                name={
                  currentStep < activity.questions.length - 1
                    ? "arrow-right"
                    : "check"
                }
                size={20}
                color="#FFF"
              />
            </View>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}
