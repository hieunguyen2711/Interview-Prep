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
      const formData = new FormData()
      formData.append("audio", audioBlob)

      const response = await fetch(`${this.baseUrl}/speech-to-text`, {
        method: "POST",
        headers: {
          "xi-api-key": this.apiKey,
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`ElevenLabs STT error: ${response.statusText}`)
      }

      const data = await response.json()
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
