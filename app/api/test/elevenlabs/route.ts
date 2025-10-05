import { NextResponse } from "next/server"

export async function GET() {
  try {
    const hasApiKey = !!process.env.ELEVENLABS_API_KEY
    const keyLength = process.env.ELEVENLABS_API_KEY?.length || 0
    const keyPreview = hasApiKey 
      ? `${process.env.ELEVENLABS_API_KEY.substring(0, 8)}...${process.env.ELEVENLABS_API_KEY.substring(keyLength - 4)}`
      : ""

    // Test if we can create the client
    let clientError = null
    try {
      const { getElevenLabsClient } = await import("@/lib/elevenlabs")
      const client = getElevenLabsClient()
    } catch (error) {
      clientError = error instanceof Error ? error.message : "Unknown error"
    }

    return NextResponse.json({
      success: true,
      hasApiKey,
      keyLength,
      keyPreview,
      clientError,
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[test] Error testing ElevenLabs:", error)
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
