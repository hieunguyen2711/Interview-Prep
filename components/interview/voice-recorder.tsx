"use client"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Circle } from "lucide-react"
import { AudioRecorder } from "@/lib/audio-recorder"

interface VoiceRecorderProps {
  isRecording: boolean
  onStartRecording: () => void
  onStopRecording: (transcript: string, audioBlob?: Blob) => void
}

export function VoiceRecorder({ isRecording, onStartRecording, onStopRecording }: VoiceRecorderProps) {
  const [recordingTime, setRecordingTime] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const recorderRef = useRef<AudioRecorder | null>(null)

  useEffect(() => {
    recorderRef.current = new AudioRecorder()
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  const handleStart = async () => {
    try {
      setError(null)
      await recorderRef.current?.startRecording()
      onStartRecording()
      setRecordingTime(0)
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start recording")
      console.error("[v0] Recording error:", err)
    }
  }

  const handleStop = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    setIsProcessing(true)

    try {
      const audioBlob = await recorderRef.current?.stopRecording()

      if (!audioBlob) {
        throw new Error("No audio recorded")
      }

      console.log("[v0] Voice recorder - Audio blob created:", {
        size: audioBlob.size,
        type: audioBlob.type
      })

      const formData = new FormData()
      formData.append("audio", audioBlob)

      console.log("[v0] Voice recorder - Sending to transcription API...")
      const response = await fetch("/api/speech/transcribe", {
        method: "POST",
        body: formData,
      })

      console.log("[v0] Voice recorder - Transcription response:", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      })

      const data = await response.json()
      console.log("[v0] Voice recorder - Transcription data:", data)

      if (!response.ok) {
        // If there's an error but we have a transcript in the response, use it
        if (data.transcript) {
          console.log("[v0] Voice recorder - Using error transcript:", data.transcript)
          onStopRecording(data.transcript, audioBlob)
        } else {
          throw new Error(data.error || "Transcription failed")
        }
      } else {
        onStopRecording(data.transcript, audioBlob)
      }
    } catch (err) {
      console.error("[v0] Transcription error:", err)
      const errorMessage = err instanceof Error ? err.message : "Unknown error"
      const mockTranscript = `Transcription failed: ${errorMessage}. Please check your ELEVENLABS_API_KEY configuration and try again.`
      onStopRecording(mockTranscript)
    } finally {
      setIsProcessing(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="text-center">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Your Response</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {isProcessing
            ? "Processing your response..."
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
