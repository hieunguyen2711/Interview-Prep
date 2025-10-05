import { NextResponse } from "next/server"

export async function GET() {
  try {
    const sessions = typeof global !== "undefined" ? (global as any).interviewSessions || {} : {}

    const sessionsArray = Object.values(sessions).sort((a: any, b: any) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    return NextResponse.json({
      sessions: sessionsArray,
    })
  } catch (error) {
    console.error("[v0] Error loading dashboard:", error)
    return NextResponse.json({ error: "Failed to load dashboard data" }, { status: 500 })
  }
}
