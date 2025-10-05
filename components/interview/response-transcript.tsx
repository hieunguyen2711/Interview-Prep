import { FileText } from "lucide-react"

interface ResponseTranscriptProps {
  transcript: string
}

export function ResponseTranscript({ transcript }: ResponseTranscriptProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <FileText className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Your Response Transcript</h3>
      </div>
      <div className="p-4 bg-muted/50 rounded-lg border border-border">
        <p className="text-sm leading-relaxed">{transcript}</p>
      </div>
    </div>
  )
}
