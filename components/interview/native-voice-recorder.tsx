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
        <h3 className="text-lg font-semibold mb-2">Your Response</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {isProcessing
            ? "Listening... Speak clearly and naturally."
            : isRecording
              ? "Recording your answer... Speak clearly and naturally."
              : "Click the microphone to start recording your answer"}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Live transcript preview */}
      {isRecording && currentTranscript && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-600 font-medium mb-1">Live Transcript:</p>
          <p className="text-sm text-blue-800">{currentTranscript}</p>
        </div>
      )}

      <div className="flex flex-col items-center gap-6">
        {isRecording && (
          <div className="flex items-center gap-3 text-primary">
            <Circle className="h-3 w-3 fill-current animate-pulse" />
            <span className="text-2xl font-mono font-semibold">{formatTime(recordingTime)}</span>
          </div>
        )}

        <div className="flex items-center gap-4">
          {!isRecording ? (
            <Button onClick={handleStart} size="lg" className="h-16 w-16 rounded-full" disabled={isProcessing}>
              <Mic className="h-6 w-6" />
            </Button>
          ) : (
            <Button onClick={handleStop} size="lg" variant="destructive" className="h-16 w-16 rounded-full">
              <MicOff className="h-6 w-6" />
            </Button>
          )}
        </div>

        {!isRecording && !isProcessing && (
          <p className="text-xs text-muted-foreground max-w-md">
            Make sure your microphone is enabled and you're in a quiet environment for best results
          </p>
        )}
      </div>
    </div>
  )
}
