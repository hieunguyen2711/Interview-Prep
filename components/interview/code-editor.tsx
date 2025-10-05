"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Play, RotateCcw } from "lucide-react"

interface CodeEditorProps {
  questionId: string
  onCodeSubmit: (code: string, output: string) => void
}

export function CodeEditor({ questionId, onCodeSubmit }: CodeEditorProps) {
  const [code, setCode] = useState(`// Write your solution here
function solution() {
  // Your code here
  
  return result;
}`)
  const [output, setOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)

  const handleRunCode = async () => {
    setIsRunning(true)
    setOutput("Running code...")

    try {
      // Simulate code execution
      // In production, this would call a sandboxed code execution API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockOutput = `Code executed successfully!

Input: [1, 2, 3, 4, 5]
Output: [2, 4, 6, 8, 10]

Time Complexity: O(n)
Space Complexity: O(n)

All test cases passed! ✓`

      setOutput(mockOutput)
      onCodeSubmit(code, mockOutput)
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsRunning(false)
    }
  }

  const handleReset = () => {
    setCode(`// Write your solution here
function solution() {
  // Your code here
  
  return result;
}`)
    setOutput("")
  }

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-card border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">Code Editor</h3>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="h-3 w-3 mr-1" />
              Reset
            </Button>
            <Button size="sm" onClick={handleRunCode} disabled={isRunning}>
              <Play className="h-3 w-3 mr-1" />
              {isRunning ? "Running..." : "Run Code"}
            </Button>
          </div>
        </div>

        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-64 p-4 bg-muted/50 border border-border rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          spellCheck={false}
        />
      </Card>

      {output && (
        <Card className="p-4 bg-card border-border">
          <h3 className="text-sm font-semibold mb-3">Output</h3>
          <pre className="p-4 bg-muted/50 border border-border rounded-lg text-sm font-mono whitespace-pre-wrap">
            {output}
          </pre>
        </Card>
      )}
    </div>
  )
}
