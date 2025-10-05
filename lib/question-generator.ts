import { getGeminiClient } from "./gemini"
import type { InterviewQuestion, InterviewType } from "@/types/interview"

interface QuestionData {
  question: string
  category: string
  difficulty: "easy" | "medium" | "hard"
  sampleTests?: { input: string; expected: string }[]
}

export async function generateInterviewQuestions(type: InterviewType, count = 5): Promise<InterviewQuestion[]> {
  // try {
  const gemini = getGeminiClient()
  const response = await gemini.generateInterviewQuestions(type, count)

  // Parse the JSON response
  const jsonMatch = response.match(/\[[\s\S]*\]/)
  if (!jsonMatch) {
    throw new Error("Failed to parse questions from Gemini response")
  }

  const questionsData: QuestionData[] = JSON.parse(jsonMatch[0])

    // Transform to InterviewQuestion format
    const questions: InterviewQuestion[] = questionsData.map((q, index) => ({
      id: `q_${Date.now()}_${index}`,
      type,
      question: q.question,
      category: q.category,
      difficulty: q.difficulty,
      sampleTests: q.sampleTests,
    }))
  // Transform to InterviewQuestion format
  const questions: InterviewQuestion[] = questionsData.map((q, index) => ({
    id: `q_${Date.now()}_${index}`,
    type,
    question: q.question,
    category: q.category,
    difficulty: q.difficulty,
  }))

  return questions
  // } catch (error) {
  //   console.error("[v0] Error generating questions:", error)

  //   // Fallback to default questions if API fails
  //   return getDefaultQuestions(type, count)
  // }
}

function getDefaultQuestions(type: InterviewType, count: number): InterviewQuestion[] {
  const behavioralQuestions: InterviewQuestion[] = [
    {
      id: "default_b1",
      type: "behavioral",
      question:
        "Tell me about a time when you had to work with a difficult team member. How did you handle the situation?",
      category: "Teamwork",
      difficulty: "medium",
    },
    {
      id: "default_b2",
      type: "behavioral",
      question:
        "Describe a situation where you had to meet a tight deadline. What steps did you take to ensure success?",
      category: "Time Management",
      difficulty: "medium",
    },
    {
      id: "default_b3",
      type: "behavioral",
      question: "Can you share an example of a project where you demonstrated leadership skills?",
      category: "Leadership",
      difficulty: "hard",
    },
    {
      id: "default_b4",
      type: "behavioral",
      question: "Tell me about a time when you failed. What did you learn from the experience?",
      category: "Problem Solving",
      difficulty: "medium",
    },
    {
      id: "default_b5",
      type: "behavioral",
      question: "Describe a situation where you had to communicate complex information to a non-technical audience.",
      category: "Communication",
      difficulty: "hard",
    },
  ]

  const technicalQuestions: InterviewQuestion[] = [
    {
      id: "default_t1",
      type: "technical",
      question:
        "Given an array of integers, find two numbers that add up to a specific target. Return the indices of the two numbers.",
      category: "Arrays",
      difficulty: "easy",
      sampleTests: [
        {
          input: "[[2, 7, 11, 15], 9]",
          expected: "[0, 1]"
        },
        {
          input: "[[3, 2, 4], 6]",
          expected: "[1, 2]"
        },
        {
          input: "[[3, 3], 6]",
          expected: "[0, 1]"
        }
      ]
    },
    {
      id: "default_t2",
      type: "technical",
      question: "Implement a function to reverse a linked list. Explain your approach and time complexity.",
      category: "Linked Lists",
      difficulty: "medium",
      sampleTests: [
        {
          input: "[[1, 2, 3, 4, 5]]",
          expected: "[5, 4, 3, 2, 1]"
        },
        {
          input: "[[1, 2]]",
          expected: "[2, 1]"
        },
        {
          input: "[[]]",
          expected: "[]"
        }
      ]
    },
    {
      id: "default_t3",
      type: "technical",
      question:
        "Design a URL shortening service like bit.ly. Discuss the system architecture, database design, and scalability considerations.",
      category: "System Design",
      difficulty: "hard",
    },
    {
      id: "default_t4",
      type: "technical",
      question:
        "Write a function to determine if a binary tree is a valid binary search tree. What's the time and space complexity?",
      category: "Trees",
      difficulty: "medium",
      sampleTests: [
        {
          input: "[[2, 1, 3]]",
          expected: "true"
        },
        {
          input: "[[5, 1, 4, null, null, 3, 6]]",
          expected: "false"
        },
        {
          input: "[[1, 1]]",
          expected: "false"
        }
      ]
    },
    {
      id: "default_t5",
      type: "technical",
      question:
        "Given a string, find the length of the longest substring without repeating characters. Optimize for time complexity.",
      category: "Strings",
      difficulty: "medium",
      sampleTests: [
        {
          input: "[\"abcabcbb\"]",
          expected: "3"
        },
        {
          input: "[\"bbbbb\"]",
          expected: "1"
        },
        {
          input: "[\"pwwkew\"]",
          expected: "3"
        }
      ]
    },
  ]

  const questions = type === "behavioral" ? behavioralQuestions : technicalQuestions
  return questions.slice(0, count)
}
