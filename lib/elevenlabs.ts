// ElevenLabs API integration for Speech-to-Text and Text-to-Speech

export class ElevenLabsClient {
  private apiKey: string
  private baseUrl = "https://api.elevenlabs.io/v1"

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async textToSpeech(text: string, voiceId = "21m00Tcm4TlvDq8ikWAM"): Promise<ArrayBuffer> {
    try {
      const response = await fetch(`${this.baseUrl}/text-to-speech/${voiceId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": this.apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`ElevenLabs TTS error: ${response.statusText}`)
      }

      return await response.arrayBuffer()
    } catch (error) {
      console.error("[v0] ElevenLabs TTS error:", error)
      throw error
    }
  }

  async speechToText(audioBlob: Blob): Promise<string> {
    try {
      console.log("[v0] ElevenLabs STT - Starting transcription:", {
        audioSize: audioBlob.size,
        audioType: audioBlob.type,
        apiKeyPresent: !!this.apiKey,
        apiKeyLength: this.apiKey?.length || 0
      })

      const formData = new FormData()
      formData.append("audio", audioBlob)

      const response = await fetch(`${this.baseUrl}/speech-to-text`, {
        method: "POST",
        headers: {
          "xi-api-key": this.apiKey,
        },
        body: formData,
      })

      console.log("[v0] ElevenLabs STT - Response status:", response.status, response.statusText)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("[v0] ElevenLabs STT - Error response:", errorText)
        throw new Error(`ElevenLabs STT error: ${response.status} ${response.statusText} - ${errorText}`)
      }

      const data = await response.json()
      console.log("[v0] ElevenLabs STT - Response data:", {
        hasText: !!data.text,
        textLength: data.text?.length || 0,
        fullResponse: data
      })

      return data.text || ""
    } catch (error) {
      console.error("[v0] ElevenLabs STT error:", error)
      throw error
    }
  }
}

// Singleton instance
let elevenLabsClient: ElevenLabsClient | null = null

export function getElevenLabsClient(): ElevenLabsClient {
  if (!elevenLabsClient) {
    const apiKey = process.env.ELEVENLABS_API_KEY
    if (!apiKey) {
      throw new Error("ELEVENLABS_API_KEY environment variable is not set")
    }
    elevenLabsClient = new ElevenLabsClient(apiKey)
  }
  return elevenLabsClient
}
