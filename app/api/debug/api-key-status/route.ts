import { NextResponse } from "next/server"

export async function GET() {
  try {
    const hasKey = !!process.env.ELEVENLABS_API_KEY
    const keyLength = process.env.ELEVENLABS_API_KEY?.length || 0
    const keyPreview = hasKey 
      ? `${process.env.ELEVENLABS_API_KEY.substring(0, 8)}...${process.env.ELEVENLABS_API_KEY.substring(keyLength - 4)}`
      : ""

    return NextResponse.json({
      hasKey,
      keyLength,
      keyPreview,
      environment: process.env.NODE_ENV,
    })
  } catch (error) {
    console.error("[debug] Error checking API key status:", error)
    return NextResponse.json({ error: "Failed to check API key status" }, { status: 500 })
  }
}
