"use client"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronUp, Bug } from "lucide-react"

interface DebugPanelProps {
  isVisible?: boolean
}

export function DebugPanel({ isVisible = false }: DebugPanelProps) {
  const [isExpanded, setIsExpanded] = useState(isVisible)
  const [apiKeyStatus, setApiKeyStatus] = useState<{
    hasKey: boolean
    keyLength: number
    keyPreview: string
  } | null>(null)

  useEffect(() => {
    // Check API key status
    const checkApiKey = async () => {
      try {
        const response = await fetch("/api/debug/api-key-status")
        if (response.ok) {
          const data = await response.json()
          setApiKeyStatus(data)
        }
      } catch (error) {
        console.error("Failed to check API key status:", error)
      }
    }

    checkApiKey()
  }, [])

  if (!isExpanded) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsExpanded(true)}
          size="sm"
          variant="outline"
          className="bg-background/80 backdrop-blur-sm"
        >
          <Bug className="h-4 w-4 mr-2" />
          Debug
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80">
      <Card className="p-4 bg-background/95 backdrop-blur-sm border-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Bug className="h-4 w-4" />
            Debug Panel
          </h3>
          <Button
            onClick={() => setIsExpanded(false)}
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-3 text-xs">
          {/* API Key Status */}
          <div>
            <h4 className="font-medium mb-1">ELEVENLABS_API_KEY Status</h4>
            {apiKeyStatus ? (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant={apiKeyStatus.hasKey ? "default" : "destructive"}>
                    {apiKeyStatus.hasKey ? "Configured" : "Missing"}
                  </Badge>
                  {apiKeyStatus.hasKey && (
                    <span className="text-muted-foreground">
                      {apiKeyStatus.keyLength} chars
                    </span>
                  )}
                </div>
                {apiKeyStatus.hasKey && (
                  <div className="text-muted-foreground font-mono text-xs">
                    {apiKeyStatus.keyPreview}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-muted-foreground">Checking...</div>
            )}
          </div>

          {/* Instructions */}
          <div>
            <h4 className="font-medium mb-1">Setup Instructions</h4>
            <div className="text-muted-foreground space-y-1">
              <p>1. Add ELEVENLABS_API_KEY to your .env file</p>
              <p>2. Restart your development server</p>
              <p>3. Check browser console for detailed logs</p>
            </div>
          </div>

          {/* Console Logs */}
          <div>
            <h4 className="font-medium mb-1">Debug Info</h4>
            <div className="text-muted-foreground">
              <p>• Open browser DevTools (F12)</p>
              <p>• Check Console tab for detailed logs</p>
              <p>• Look for "[v0]" prefixed messages</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
