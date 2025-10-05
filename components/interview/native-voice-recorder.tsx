"use client"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Circle, AlertCircle } from "lucide-react"
import { getSpeechRecognitionService } from "@/lib/speech-recognition"

interface NativeVoiceRecorderProps {
  isRecording: boolean
  onStartRecording: () => void
  onStopRecording: (transcript: string) => void
  resetTranscript?: boolean // New prop to trigger transcript reset
}

export function NativeVoiceRecorder({ isRecording, onStartRecording, onStopRecording, resetTranscript }: NativeVoiceRecorderProps) {
  const [recordingTime, setRecordingTime] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentTranscript, setCurrentTranscript] = useState("")
  const [isSupported, setIsSupported] = useState(false)
  
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const speechServiceRef = useRef<ReturnType<typeof getSpeechRecognitionService> | null>(null)

  useEffect(() => {
    // Check if speech recognition is supported
    const service = getSpeechRecognitionService()
    setIsSupported(service.isSpeechRecognitionSupported())
    speechServiceRef.current = service

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (speechServiceRef.current) {
        speechServiceRef.current.abortRecognition()
      }
    }
  }, [])

  // Reset transcript when resetTranscript prop changes
  useEffect(() => {
    if (resetTranscript) {
      setCurrentTranscript("")
    }
  }, [resetTranscript])

  const handleStart = async () => {
    if (!speechServiceRef.current) {
      setError("Speech recognition not available")
      return
    }

    try {
      setError(null)
      setCurrentTranscript("") // Clear any previous transcript
      setIsProcessing(true)

      // Start speech recognition
      speechServiceRef.current.startRecognition(
        (transcript, isFinal) => {
          setCurrentTranscript(transcript)
          if (isFinal) {
            console.log("[v0] Final transcript:", transcript)
          }
        },
        (errorMessage) => {
          setError(errorMessage)
          setIsProcessing(false)
        },
        () => {
          // Recognition ended
          setIsProcessing(false)
          if (currentTranscript.trim()) {
            onStopRecording(currentTranscript.trim())
          }
        }
      )

      onStartRecording()
      setRecordingTime(0)
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start recording")
      console.error("[v0] Recording error:", err)
      setIsProcessing(false)
    }
  }

  const handleStop = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    if (speechServiceRef.current) {
      speechServiceRef.current.stopRecognition()
    }

    setIsProcessing(false)
    
    // Use the current transcript if available
    if (currentTranscript.trim()) {
      onStopRecording(currentTranscript.trim())
    } else {
      onStopRecording("No speech detected. Please try speaking again.")
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (!isSupported) {
    return (
      <div className="text-center">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Speech Recognition Not Supported</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your browser doesn't support speech recognition. Please use Chrome, Edge, or Safari for the best experience.
          </p>
        </div>
        
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-800">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Browser Compatibility</span>
          </div>
          <p className="text-sm text-yellow-700 mt-1">
            Speech recognition works best in Chrome, Edge, and Safari. Firefox has limited support.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="text-center">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-white">Your Response</h3>
        <p className="text-sm text-gray-400 leading-relaxed">
          {isProcessing
            ? "Listening... Speak clearly and naturally."
            : isRecording
              ? "Recording your answer... Speak clearly and naturally."
              : "Click the microphone to start recording your answer"}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-600/30 rounded-lg">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Live transcript preview */}
      {isRecording && currentTranscript && (
        <div className="mb-4 p-3 bg-red-900/10 border border-red-600/30 rounded-lg">
          <p className="text-xs text-red-400 font-medium mb-1">Live Transcript:</p>
          <p className="text-sm text-white font-mono">{currentTranscript}</p>
        </div>
      )}

      <div className="flex flex-col items-center gap-6">
        {isRecording && (
          <div className="flex items-center gap-3 text-red-500">
            <Circle className="h-3 w-3 fill-current animate-pulse" />
            <span className="text-2xl font-mono font-semibold text-white">{formatTime(recordingTime)}</span>
          </div>
        )}

        <div className="flex items-center gap-4">
          {!isRecording ? (
            <Button 
              onClick={handleStart} 
              size="lg" 
              className="h-20 w-20 rounded-full bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 border-2 border-red-500/50 hover:border-red-400 hover:scale-105 transition-all duration-300 shadow-lg shadow-red-500/25 hover:shadow-red-500/40 relative overflow-hidden" 
              disabled={isProcessing}
            >
              {/* Subtle Spider Web Pattern on Button */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1 left-1 w-3 h-3 border border-white/20 rounded-full"></div>
                <div className="absolute bottom-1 right-1 w-2 h-2 border border-white/20 rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 w-1 h-1 border border-white/20 rounded-full"></div>
              </div>
              <Mic className="h-8 w-8 text-white relative z-10" />
            </Button>
          ) : (
            <Button 
              onClick={handleStop} 
              size="lg" 
              variant="destructive" 
              className="h-20 w-20 rounded-full bg-gradient-to-br from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 border-2 border-red-600/50 hover:border-red-500 hover:scale-105 transition-all duration-300 shadow-lg shadow-red-600/30 hover:shadow-red-600/50 animate-pulse relative overflow-hidden"
            >
              {/* Subtle Spider Web Pattern on Button */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1 left-1 w-3 h-3 border border-white/20 rounded-full"></div>
                <div className="absolute bottom-1 right-1 w-2 h-2 border border-white/20 rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 w-1 h-1 border border-white/20 rounded-full"></div>
              </div>
              <MicOff className="h-8 w-8 text-white relative z-10" />
            </Button>
          )}
        </div>

        {!isRecording && !isProcessing && (
          <p className="text-xs text-gray-400 max-w-md">
            Make sure your microphone is enabled and you're in a quiet environment for best results
          </p>
        )}
      </div>
    </div>
  )
}
