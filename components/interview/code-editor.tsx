"use client"
import { useState } from "react"
import Editor from "@monaco-editor/react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Play, RotateCcw } from "lucide-react"

export function CodeEditor({
  questionId,
  onCodeSubmit,
  onRun,
}: {
  questionId?: string
  onCodeSubmit?: (code: string, output: string) => void
  onRun?: (code: string) => void
}) {
  const [code, setCode] = useState(`// Write your solution here
def solution(arr):
  return arr.map(x => x * 2)
`)

  const handleReset = () => {
    setCode(`// Write your solution here
def solution(arr):
  return arr.map(x => x * 2);
`)
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
            <Button
              size="sm"
              onClick={() => {
                // Prefer the newer onCodeSubmit signature if provided
                if (onCodeSubmit) {
                  // In this simple editor we don't execute code; pass empty output for now
                  onCodeSubmit(code, "")
                } else if (onRun) {
                  onRun(code)
                }
              }}
            >
              <Play className="h-3 w-3 mr-1" />
              Run Code
            </Button>
          </div>
        </div>

        <Editor
          height="400px"
          language="python"
          value={code}
          theme="vs-dark"
          onChange={(value) => setCode(value || "")}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            lineNumbers: "on",
            scrollBeyondLastLine: false,
          }}
        />
      </Card>
    </div>
  )
}
