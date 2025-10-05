// Browser-native speech recognition using Web Speech API
// This works without any external API keys

export class SpeechRecognitionService {
  private recognition: any = null
  private isSupported: boolean = false

  constructor() {
    this.initializeRecognition()
  }

  private initializeRecognition() {
    // Check for browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    
    if (!SpeechRecognition) {
      console.warn("[speech] Speech recognition not supported in this browser")
      this.isSupported = false
      return
    }

    this.isSupported = true
    this.recognition = new SpeechRecognition()
    
    // Configure recognition settings
    this.recognition.continuous = true
    this.recognition.interimResults = true
    this.recognition.lang = 'en-US'
    this.recognition.maxAlternatives = 1
  }

  isSpeechRecognitionSupported(): boolean {
    return this.isSupported
  }

  startRecognition(
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (error: string) => void,
    onEnd: () => void
  ): void {
    if (!this.isSupported || !this.recognition) {
      onError("Speech recognition not supported in this browser")
      return
    }

    let finalTranscript = ""
    let interimTranscript = ""

    this.recognition.onstart = () => {
      console.log("[speech] Recognition started")
    }

    this.recognition.onresult = (event: any) => {
      interimTranscript = ""
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        
        if (event.results[i].isFinal) {
          finalTranscript += transcript + " "
        } else {
          interimTranscript += transcript
        }
      }

      // Send the combined transcript
      const combinedTranscript = finalTranscript + interimTranscript
      onResult(combinedTranscript, interimTranscript === "")
    }

    this.recognition.onerror = (event: any) => {
      console.error("[speech] Recognition error:", event.error)
      let errorMessage = "Speech recognition error"
      
      switch (event.error) {
        case 'no-speech':
          errorMessage = "No speech detected. Please try again."
          break
        case 'audio-capture':
          errorMessage = "No microphone found. Please check your microphone."
          break
        case 'not-allowed':
          errorMessage = "Microphone permission denied. Please allow microphone access."
          break
        case 'network':
          errorMessage = "Network error occurred during speech recognition."
          break
        default:
          errorMessage = `Speech recognition error: ${event.error}`
      }
      
      onError(errorMessage)
    }

    this.recognition.onend = () => {
      console.log("[speech] Recognition ended")
      onEnd()
    }

    try {
      this.recognition.start()
    } catch (error) {
      console.error("[speech] Failed to start recognition:", error)
      onError("Failed to start speech recognition")
    }
  }

  stopRecognition(): void {
    if (this.recognition) {
      this.recognition.stop()
    }
  }

  abortRecognition(): void {
    if (this.recognition) {
      this.recognition.abort()
    }
  }
}

// Singleton instance
let speechService: SpeechRecognitionService | null = null

export function getSpeechRecognitionService(): SpeechRecognitionService {
  if (!speechService) {
    speechService = new SpeechRecognitionService()
  }
  return speechService
}
