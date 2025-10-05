"use client"
import { useState } from "react"
import { Volume2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { InterviewQuestion } from "@/types/interview"

interface QuestionDisplayProps {
  question: InterviewQuestion
}

export function QuestionDisplay({ question }: QuestionDisplayProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlayAudio = async () => {
    try {
      setIsPlaying(true)

      const response = await fetch("/api/speech/synthesize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: question.question }),
      })

      if (!response.ok) {
        throw new Error("Failed to synthesize speech")
      }

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)

      audio.onended = () => {
        setIsPlaying(false)
        URL.revokeObjectURL(audioUrl)
      }

      await audio.play()
    } catch (error) {
      console.error("[v0] TTS error:", error)
      setIsPlaying(false)
    }
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          {question.category && (
            <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full mb-3">
              {question.category}
            </span>
          )}
          <h2 className="text-2xl font-semibold leading-relaxed text-balance">{question.question}</h2>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={handlePlayAudio}
          disabled={isPlaying}
          className="flex-shrink-0 bg-transparent"
        >
          {isPlaying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Volume2 className="h-4 w-4" />}
        </Button>
      </div>

      {question.difficulty && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Difficulty:</span>
          <span
            className={`font-medium ${
              question.difficulty === "easy"
                ? "text-green-500"
                : question.difficulty === "medium"
                  ? "text-yellow-500"
                  : "text-red-500"
            }`}
          >
            {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
          </span>
        </div>
      )}
    </div>
  )
}
