import { NextResponse } from "next/server"
import { generateInterviewQuestions } from "@/lib/question-generator"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params

    const sessions = typeof global !== "undefined" ? (global as any).interviewSessions || {} : {}
    let session = sessions[id]

    // If session doesn't exist, create a default behavioral session
    if (!session) {
      console.log(`[v0] Session ${id} not found, creating default behavioral session`)
      
      try {
        const questions = await generateInterviewQuestions("behavioral", 5)
        
        session = {
          id,
          type: "behavioral",
          questions,
          responses: [],
          createdAt: new Date(),
        }

        // Store the new session in memory
        if (typeof global !== "undefined") {
          ;(global as any).interviewSessions = (global as any).interviewSessions || {}
          ;(global as any).interviewSessions[id] = session
        }
      } catch (error) {
        console.error("[v0] Error creating default session:", error)
        return NextResponse.json({ error: "Failed to create interview session" }, { status: 500 })
      }
    }

    return NextResponse.json({
      sessionId: id,
      type: session.type,
      questions: session.questions,
      responses: session.responses || [],
    })
  } catch (error) {
    console.error("[v0] Error fetching interview:", error)
    return NextResponse.json({ error: "Failed to fetch interview session" }, { status: 500 })
  }
}
