import { NextResponse } from "next/server"
import { generateFeedback } from "@/lib/feedback-generator"
import type { InterviewQuestion, InterviewResponse } from "@/types/interview"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { questionId, transcript } = await request.json()

    if (!questionId || !transcript) {
      return NextResponse.json({ error: "Missing questionId or transcript" }, { status: 400 })
    }

    // Retrieve the session
    const sessions = typeof global !== "undefined" ? (global as any).interviewSessions || {} : {}
    const session = sessions[id]

    if (!session) {
      return NextResponse.json({ error: "Interview session not found" }, { status: 404 })
    }

    // Find the question
    const question = session.questions.find((q: InterviewQuestion) => q.id === questionId)
    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 })
    }

    // Create a temporary response object for grading
    const tempResponse: InterviewResponse = {
      questionId,
      transcript,
      timestamp: new Date(),
    }

    // Generate feedback using Gemini
    const feedback = await generateFeedback(question, tempResponse)

    return NextResponse.json({
      success: true,
      feedback,
    })
  } catch (error) {
    console.error("[v0] Error grading response:", error)
    return NextResponse.json({ error: "Failed to grade response" }, { status: 500 })
  }
}
