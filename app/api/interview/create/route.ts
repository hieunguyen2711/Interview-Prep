import { NextResponse } from "next/server"
import { generateInterviewQuestions } from "@/lib/question-generator"
import type { InterviewType } from "@/types/interview"

export async function POST(request: Request) {
  try {
    const { type } = await request.json()

    // Validate interview type
    if (type !== "behavioral" && type !== "technical") {
      return NextResponse.json({ error: "Invalid interview type" }, { status: 400 })
    }

    // Generate a unique session ID
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const questions = await generateInterviewQuestions(type as InterviewType, 5)

    // In a real implementation, this would also:
    // 1. Store session in Firebase with questions
    // For now, we'll store in memory (will be replaced with Firebase)

    // Store questions temporarily (in production, use Firebase)
    if (typeof global !== "undefined") {
      ;(global as any).interviewSessions = (global as any).interviewSessions || {}
      ;(global as any).interviewSessions[sessionId] = {
        id: sessionId,
        type,
        questions,
        responses: [],
        createdAt: new Date(),
      }
    }

    return NextResponse.json({
      sessionId,
      type,
      questionsCount: questions.length,
      message: "Interview session created successfully",
    })
  } catch (error) {
    console.error("[v0] Error creating interview:", error)
    return NextResponse.json({ error: "Failed to create interview session" }, { status: 500 })
  }
}
