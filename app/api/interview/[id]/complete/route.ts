import { NextResponse } from "next/server"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const sessions = typeof global !== "undefined" ? (global as any).interviewSessions || {} : {}
    const session = sessions[id]

    if (!session) {
      return NextResponse.json({ error: "Interview session not found" }, { status: 404 })
    }

    // Mark session as complete
    session.completedAt = new Date()
    session.status = "completed"

    console.log("[v0] Completing interview session:", id)

    return NextResponse.json({
      success: true,
      message: "Interview completed successfully",
    })
  } catch (error) {
    console.error("[v0] Error completing interview:", error)
    return NextResponse.json({ error: "Failed to complete interview" }, { status: 500 })
  }
}
