import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
  const { id } = await params

    const sessions = typeof global !== "undefined" ? (global as any).interviewSessions || {} : {}
    const session = sessions[id]

    if (!session) {
      return NextResponse.json({ error: "Interview session not found" }, { status: 404 })
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
