"use client"

import { useState, useEffect } from "react"
import Editor from "@monaco-editor/react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Play, RotateCcw } from "lucide-react"
import type { InterviewQuestion } from "@/types/interview"

const LANGUAGE_PRESETS: Record<string, { template: string; monacoLang: string }> = {
  python: {
    template: `def solution(arr):\n  # Write your solution here\n`,
    monacoLang: "python",
  },
  javascript: {
    template: `function solution(arr) {\n  // Write your solution here\n}\n`,
    monacoLang: "javascript",
  },
  typescript: {
    template: `function solution(arr: number[]): number[] {\n// Write your solution here\n}\n`,
    monacoLang: "typescript",
  },
}

export function CodeEditor({
  question,
  onCodeSubmit,
  onRun,
}: {
  question?: InterviewQuestion
  onCodeSubmit?: (code: string, output: string) => void
  onRun?: (code: string) => void
}) {
  const defaultLang = "python"
  const [language, setLanguage] = useState<string>(defaultLang)
  const [code, setCode] = useState<string>(LANGUAGE_PRESETS[defaultLang].template)
  const [output, setOutput] = useState<string>("")

  useEffect(() => {
    // If question has language hint or samples in future, we could set language here.
  }, [question])

  const handleReset = () => {
    setCode(LANGUAGE_PRESETS[language]?.template || "")
    setOutput("")
  }

  const runTests = () => {
    // Simple runner: only supports javascript language tests executed in the browser.
    if (language === "javascript" || language === "typescript") {
      try {
        // Create a function wrapper that returns the solution function
        // eslint-disable-next-line no-new-func
        const fn = new Function(`${code}\nreturn solution`)()
        if (typeof fn !== "function") throw new Error("No solution function found")

        if (question?.sampleTests?.length) {
          const results = question.sampleTests.map((t, i) => {
            let parsedInput: any = null
            try {
              parsedInput = JSON.parse(t.input)
            } catch (e) {
              // fallback: treat as single primitive
              parsedInput = t.input
            }

            const actual = fn(parsedInput)
            const expected = (() => {
              try {
                return JSON.parse(t.expected)
              } catch (e) {
                return t.expected
              }
            })()

            const pass = JSON.stringify(actual) === JSON.stringify(expected)
            return { pass, actual, expected }
          })

          setOutput(JSON.stringify(results, null, 2))
          if (onCodeSubmit) onCodeSubmit(code, JSON.stringify(results))
          else if (onRun) onRun(code)
        } else {
          // No sample tests; just run the function with a demo input if possible
          const demo = [1, 2, 3]
          const actual = fn(demo)
          setOutput(String(actual))
          if (onCodeSubmit) onCodeSubmit(code, String(actual))
          else if (onRun) onRun(code)
        }
      } catch (err: any) {
        setOutput(String(err?.message || err))
        if (onCodeSubmit) onCodeSubmit(code, String(err?.message || err))
      }
    } else if (language === "python") {
      // Python execution is not supported client-side. We simply send code to onCodeSubmit with empty output.
      setOutput("Python execution not supported in-browser")
      if (onCodeSubmit) onCodeSubmit(code, "")
      else if (onRun) onRun(code)
    } else {
      setOutput("Language not supported for in-browser run")
      if (onCodeSubmit) onCodeSubmit(code, "")
    }
  }

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-card border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <h3 className="text-sm font-semibold">Code Editor</h3>
            <select
              value={language}
              onChange={(e) => {
                const newLang = e.target.value
                setLanguage(newLang)
                setCode(LANGUAGE_PRESETS[newLang]?.template || "")
                setOutput("")
              }}
              className="rounded-md border px-2 py-1 text-sm"
            >
              {Object.keys(LANGUAGE_PRESETS).map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="h-3 w-3 mr-1" />
              Reset
            </Button>
            <Button size="sm" onClick={runTests}>
              <Play className="h-3 w-3 mr-1" />
              Run Code
            </Button>
          </div>
        </div>

        <Editor
          height="400px"
          language={LANGUAGE_PRESETS[language]?.monacoLang || "javascript"}
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

        <div className="mt-3">
          <h4 className="text-sm font-medium">Sample Tests</h4>
          {question?.sampleTests?.length ? (
            <pre className="mt-2 p-2 bg-muted rounded text-sm overflow-auto">{JSON.stringify(question.sampleTests, null, 2)}</pre>
          ) : (
            <p className="text-muted-foreground text-sm mt-1">No sample tests provided for this question.</p>
          )}

          <h4 className="text-sm font-medium mt-3">Output</h4>
          <pre className="mt-2 p-2 bg-muted rounded text-sm overflow-auto">{output}</pre>
        </div>
      </Card>
    </div>
  )
}
