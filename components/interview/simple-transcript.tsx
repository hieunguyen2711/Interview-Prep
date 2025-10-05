"use client"
import { Card } from "@/components/ui/card"

interface SimpleTranscriptProps {
  transcript: string
}

export function SimpleTranscript({ transcript }: SimpleTranscriptProps) {
  if (!transcript || transcript.trim().length === 0) {
    return null
  }

  return (
    <Card className="p-6 bg-card border-border">
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Your Response</h3>
        <div className="bg-muted/50 p-4 rounded-lg">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {transcript}
          </p>
        </div>
      </div>
    </Card>
  )
}
