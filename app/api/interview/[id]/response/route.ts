import { NextResponse } from "next/server"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const response = await request.json()

    const sessions = typeof global !== "undefined" ? (global as any).interviewSessions || {} : {}
    const session = sessions[id]

    if (!session) {
      return NextResponse.json({ error: "Interview session not found" }, { status: 404 })
    }

    // Add response to session
    session.responses = session.responses || []
    session.responses.push(response)

    console.log("[v0] Saving response for session:", id, response)

    return NextResponse.json({
      success: true,
      message: "Response saved successfully",
    })
  } catch (error) {
    console.error("[v0] Error saving response:", error)
    return NextResponse.json({ error: "Failed to save response" }, { status: 500 })
  }
}
