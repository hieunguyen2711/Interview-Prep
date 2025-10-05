"use client"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Copy, Volume2, AlertCircle, CheckCircle } from "lucide-react"
import { useState } from "react"

interface EnhancedResponseTranscriptProps {
  transcript: string
  isPlaceholder?: boolean
  onRetry?: () => void
}

export function EnhancedResponseTranscript({ 
  transcript, 
  isPlaceholder = false, 
  onRetry 
}: EnhancedResponseTranscriptProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(transcript)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy text:", error)
    }
  }

  const isError = transcript.includes("Transcription failed") || transcript.includes("Error") || transcript.includes("No speech detected")
  const isSample = transcript.includes("This is a sample transcript")

  return (
    <Card className="p-6 bg-card border-border">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            {isError ? (
              <AlertCircle className="h-5 w-5 text-red-500" />
            ) : isSample ? (
              <AlertCircle className="h-5 w-5 text-yellow-500" />
            ) : (
              <CheckCircle className="h-5 w-5 text-green-500" />
            )}
            Your Response Transcript
          </h3>
          
          <div className="flex items-center gap-2">
            {!isSample && !isError && (
              <Button
                onClick={handleCopy}
                size="sm"
                variant="outline"
                className="h-8"
              >
                {copied ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {copied ? "Copied!" : "Copy"}
              </Button>
            )}
            
            {onRetry && (
              <Button
                onClick={onRetry}
                size="sm"
                variant="outline"
                className="h-8"
              >
                <Volume2 className="h-4 w-4 mr-1" />
                Retry
              </Button>
            )}
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          {isError ? (
            <Badge variant="destructive">Transcription Error</Badge>
          ) : isSample ? (
            <Badge variant="secondary">Sample Text - API Key Needed</Badge>
          ) : (
            <Badge variant="default">Transcribed Successfully</Badge>
          )}
          
          {!isSample && !isError && (
            <Badge variant="outline">
              {transcript.length} characters
            </Badge>
          )}
        </div>

        {/* Transcript Content */}
        <div className="space-y-3">
          {isSample ? (
            <div className="space-y-3">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800 font-medium mb-2">
                  ⚠️ Speech-to-Text Not Configured
                </p>
                <p className="text-sm text-yellow-700 mb-3">
                  {transcript}
                </p>
                <div className="text-xs text-yellow-600 space-y-1">
                  <p><strong>To fix this:</strong></p>
                  <p>1. Get your API key from <a href="https://elevenlabs.io/app/settings/api-keys" target="_blank" rel="noopener noreferrer" className="underline">ElevenLabs</a></p>
                  <p>2. Create a <code className="bg-yellow-100 px-1 rounded">.env</code> file in your project root</p>
                  <p>3. Add: <code className="bg-yellow-100 px-1 rounded">ELEVENLABS_API_KEY=your_key_here</code></p>
                  <p>4. Restart your development server</p>
                </div>
              </div>
            </div>
          ) : isError ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800 font-medium mb-2">
                ❌ Transcription Failed
              </p>
              <p className="text-sm text-red-700 mb-3">
                {transcript}
              </p>
              <div className="text-xs text-red-600 space-y-1">
                <p><strong>Possible solutions:</strong></p>
                <p>• Check your ELEVENLABS_API_KEY is correct</p>
                <p>• Ensure you have sufficient API credits</p>
                <p>• Try speaking more clearly and closer to the microphone</p>
                <p>• Check your internet connection</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800 font-medium mb-2">
                  ✅ Successfully Transcribed
                </p>
                <p className="text-sm text-green-700">
                  Your speech has been converted to text and is ready for AI analysis.
                </p>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm font-medium mb-2">Transcribed Text:</p>
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                  {transcript}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Debug Info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-3 bg-gray-100 rounded-lg">
            <p className="text-xs font-medium text-gray-600 mb-1">Debug Info:</p>
            <div className="text-xs text-gray-500 space-y-1">
              <p>• Transcript length: {transcript.length} characters</p>
              <p>• Is placeholder: {isSample ? "Yes" : "No"}</p>
              <p>• Has error: {isError ? "Yes" : "No"}</p>
              <p>• Environment: {process.env.NODE_ENV}</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
