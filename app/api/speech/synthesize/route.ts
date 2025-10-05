import { NextResponse } from "next/server"
import { getElevenLabsClient } from "@/lib/elevenlabs"

export async function POST(request: Request) {
  try {
    const { text } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 })
    }

    // Check if API key is configured
    if (!process.env.ELEVENLABS_API_KEY) {
      console.log("[v0] ELEVENLABS_API_KEY not configured, TTS unavailable")
      return NextResponse.json({ error: "TTS service not configured" }, { status: 503 })
    }

    const client = getElevenLabsClient()
    const audioBuffer = await client.textToSpeech(text)

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.byteLength.toString(),
      },
    })
  } catch (error) {
    console.error("[v0] TTS error:", error)
    return NextResponse.json({ error: "Failed to synthesize speech" }, { status: 500 })
  }
}
