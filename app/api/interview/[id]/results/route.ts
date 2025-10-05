import { NextResponse } from "next/server"
import { generateFeedback, generateOverallFeedback } from "@/lib/feedback-generator"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
  const { id } = await params

    // Retrieve the session (still from global memory for now)
    const sessions = typeof global !== "undefined" ? (global as any).interviewSessions || {} : {}
    const session = sessions[id]

    if (!session) {
      return NextResponse.json({ error: "Interview session not found" }, { status: 404 })
    }

    // 🔹 Instead of returning stored feedback, actually generate it via Gemini
    const feedbacks = await Promise.all(
      session.responses.map(async (response: any) => {
        const question = session.questions.find((q: any) => q.id === response.questionId)
        if (!question) return null
        return await generateFeedback(question, response)  // Gemini call
      }),
    )

    const validFeedbacks = feedbacks.filter((f) => f !== null)

    // 🔹 Generate overall feedback with Gemini
    const overallFeedback = await generateOverallFeedback(session.questions, session.responses, validFeedbacks)

    return NextResponse.json({
      sessionId: id,
      questions: session.questions,
      responses: session.responses,
      feedbacks: validFeedbacks,
      overallFeedback,
    })
  } catch (error) {
    console.error("[results] Error generating results:", error)
    return NextResponse.json({ error: "Failed to generate results" }, { status: 500 })
  }
}
