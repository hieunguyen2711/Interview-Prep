import { NextResponse } from "next/server"
import { getElevenLabsClient } from "@/lib/elevenlabs"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get("audio") as Blob

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 })
    }

    console.log("[v0] Audio file received:", {
      size: audioFile.size,
      type: audioFile.type,
      hasApiKey: !!process.env.ELEVENLABS_API_KEY,
      apiKeyLength: process.env.ELEVENLABS_API_KEY?.length || 0
    })

    // Check if API key is configured
    if (!process.env.ELEVENLABS_API_KEY) {
      console.log("[v0] ELEVENLABS_API_KEY not configured, using fallback")
      return NextResponse.json({
        transcript:
          "This is a sample transcript. Please configure ELEVENLABS_API_KEY to enable real speech-to-text transcription.",
      })
    }

    console.log("[v0] Attempting speech-to-text with ElevenLabs...")
    const client = getElevenLabsClient()
    const transcript = await client.speechToText(audioFile)

    console.log("[v0] Transcription successful:", {
      transcriptLength: transcript.length,
      transcriptPreview: transcript.substring(0, 100) + (transcript.length > 100 ? "..." : "")
    })

    return NextResponse.json({ transcript })
  } catch (error) {
    console.error("[v0] Transcription error:", error)
    
    // Return a more helpful error message
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ 
      error: "Failed to transcribe audio",
      details: errorMessage,
      transcript: `Transcription failed: ${errorMessage}. Please check your ELEVENLABS_API_KEY and try again.`
    }, { status: 500 })
  }
}
