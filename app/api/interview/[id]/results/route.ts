import { NextResponse } from "next/server"
import { generateFeedback, generateOverallFeedback } from "@/lib/feedback-generator"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
  const { id } = await params

    const sessions = typeof global !== "undefined" ? (global as any).interviewSessions || {} : {}
    const session = sessions[id]

    if (!session) {
      return NextResponse.json({ error: "Interview session not found" }, { status: 404 })
    }

    // Generate feedback for each response if not already generated
    const feedbacks = await Promise.all(
      session.responses.map(async (response: any) => {
        const question = session.questions.find((q: any) => q.id === response.questionId)
        if (!question) return null
        return await generateFeedback(question, response)
      }),
    )

    const validFeedbacks = feedbacks.filter((f) => f !== null)

    // Generate overall feedback
    const overallFeedback = await generateOverallFeedback(session.questions, session.responses, validFeedbacks)

    return NextResponse.json({
      sessionId: id,
      questions: session.questions,
      responses: session.responses,
      feedbacks: validFeedbacks,
      overallFeedback,
    })
  } catch (error) {
    console.error("[v0] Error generating results:", error)
    return NextResponse.json({ error: "Failed to generate results" }, { status: 500 })
  }
}
