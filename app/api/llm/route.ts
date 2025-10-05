import { NextResponse } from "next/server"
import { generateFeedback, generateOverallFeedback } from "@/lib/feedback-generator"
import type { InterviewQuestion, InterviewResponse } from "@/types/interview"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { questions, responses } = body as {
      questions: InterviewQuestion[]
      responses: InterviewResponse[]
    }

    if (!questions || !responses) {
      return NextResponse.json({ error: "Missing questions or responses" }, { status: 400 })
    }

    // Generate feedback per response using Gemini
    const feedbacks = await Promise.all(
      responses.map((response) => {
        const question = questions.find((q) => q.id === response.questionId)
        if (!question) return null
        return generateFeedback(question, response)
      }),
    )

    const validFeedbacks = feedbacks.filter((f) => f !== null)

    // Generate overall feedback using Gemini
    const overallFeedback = await generateOverallFeedback(questions, responses, validFeedbacks as any)

    return NextResponse.json({
      questions,
      responses,
      feedbacks: validFeedbacks,
      overallFeedback,
    })
  } catch (error) {
    console.error("[llm] Error generating interview feedback:", error)
    return NextResponse.json({ error: "Failed to generate interview feedback" }, { status: 500 })
  }
}
