"use client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, ExternalLink, CheckCircle, AlertCircle } from "lucide-react"
import { useState } from "react"

export function SetupGuide() {
  const [copied, setCopied] = useState<string | null>(null)

  const handleCopy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(key)
      setTimeout(() => setCopied(null), 2000)
    } catch (error) {
      console.error("Failed to copy text:", error)
    }
  }

  const envContent = `# ElevenLabs API Key for Speech-to-Text
# Get your API key from: https://elevenlabs.io/app/settings/api-keys
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here

# Gemini API Key for AI feedback
# Get your API key from: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here

# Auth0 Configuration (if using authentication)
AUTH0_SECRET=your_auth0_secret_here
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://your-domain.auth0.com
AUTH0_CLIENT_ID=your_auth0_client_id_here
AUTH0_CLIENT_SECRET=your_auth0_client_secret_here`

  return (
    <Card className="p-6 bg-card border-border">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">🚀 Setup Speech-to-Text</h2>
          <p className="text-muted-foreground">
            Follow these steps to enable real speech transcription
          </p>
        </div>

        {/* Step 1: Get API Key */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="default">Step 1</Badge>
            <h3 className="font-semibold">Get ElevenLabs API Key</h3>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Visit ElevenLabs to get your free API key:
            </p>
            <Button
              onClick={() => window.open('https://elevenlabs.io/app/settings/api-keys', '_blank')}
              variant="outline"
              size="sm"
              className="w-fit"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Get API Key
            </Button>
          </div>
        </div>

        {/* Step 2: Create .env file */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="default">Step 2</Badge>
            <h3 className="font-semibold">Create .env File</h3>
          </div>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Create a <code className="bg-muted px-1 rounded">.env</code> file in your project root with:
            </p>
            <div className="relative">
              <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
                <code>{envContent}</code>
              </pre>
              <Button
                onClick={() => handleCopy(envContent, 'env')}
                size="sm"
                variant="outline"
                className="absolute top-2 right-2 h-6 w-6 p-0"
              >
                {copied === 'env' ? (
                  <CheckCircle className="h-3 w-3 text-green-500" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Step 3: Add your API key */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="default">Step 3</Badge>
            <h3 className="font-semibold">Add Your API Key</h3>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Replace <code className="bg-muted px-1 rounded">your_elevenlabs_api_key_here</code> with your actual API key:
            </p>
            <div className="p-3 bg-muted rounded-lg">
              <code className="text-sm">ELEVENLABS_API_KEY=sk-1234567890abcdef...</code>
            </div>
          </div>
        </div>

        {/* Step 4: Restart server */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="default">Step 4</Badge>
            <h3 className="font-semibold">Restart Development Server</h3>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Stop your current server (Ctrl+C) and restart it:
            </p>
            <div className="flex gap-2">
              <Button
                onClick={() => handleCopy('npm run dev', 'npm')}
                variant="outline"
                size="sm"
              >
                {copied === 'npm' ? (
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4 mr-2" />
                )}
                npm run dev
              </Button>
              <Button
                onClick={() => handleCopy('yarn dev', 'yarn')}
                variant="outline"
                size="sm"
              >
                {copied === 'yarn' ? (
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4 mr-2" />
                )}
                yarn dev
              </Button>
            </div>
          </div>
        </div>

        {/* Troubleshooting */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Troubleshooting</Badge>
            <h3 className="font-semibold">Common Issues</h3>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 text-yellow-500" />
              <div>
                <p className="font-medium">Still seeing placeholder text?</p>
                <p>Make sure the .env file is in the project root (same level as package.json)</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 text-yellow-500" />
              <div>
                <p className="font-medium">API key not working?</p>
                <p>Check that your ElevenLabs account has sufficient credits</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 text-yellow-500" />
              <div>
                <p className="font-medium">No audio being recorded?</p>
                <p>Allow microphone permissions in your browser</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
