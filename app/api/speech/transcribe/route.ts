import { NextResponse } from "next/server"
import { getElevenLabsClient } from "@/lib/elevenlabs"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get("audio") as Blob

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 })
    }

    // Check if API key is configured
    if (!process.env.ELEVENLABS_API_KEY) {
      console.log("[v0] ELEVENLABS_API_KEY not configured, using fallback")
      return NextResponse.json({
        transcript:
          "This is a sample transcript. Please configure ELEVENLABS_API_KEY to enable real speech-to-text transcription.",
      })
    }

    const client = getElevenLabsClient()
    const transcript = await client.speechToText(audioFile)

    return NextResponse.json({ transcript })
  } catch (error) {
    console.error("[v0] Transcription error:", error)
    return NextResponse.json({ error: "Failed to transcribe audio" }, { status: 500 })
  }
}
