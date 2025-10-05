export type InterviewType = "behavioral" | "technical"

export interface InterviewQuestion {
  id: string
  type: InterviewType
  question: string
  category?: string
  difficulty?: "easy" | "medium" | "hard"
  // Optional sample tests for technical questions. Each test has an input (string) and expected output (string).
  sampleTests?: { input: string; expected: string }[]
}

export interface InterviewResponse {
  questionId: string
  transcript: string
  timestamp: Date
  audioUrl?: string
  code?: string
}

export interface FeedbackResult {
  questionId: string
  responseId: string
  score: number
  strengths: string[]
  improvements: string[]
  detailedAnalysis: string
  sentiment: "positive" | "neutral" | "negative"
  generatedAt: Date
}

export interface InterviewSession {
  id: string
  type: InterviewType
  questions: InterviewQuestion[]
  responses: InterviewResponse[]
  feedbacks?: FeedbackResult[]
  createdAt: Date
  completedAt?: Date
  status: "in-progress" | "completed"
}
