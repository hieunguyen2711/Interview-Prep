"use client"

import { useState, useEffect } from "react"
import Editor from "@monaco-editor/react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Play, RotateCcw, Loader2 } from "lucide-react"
import type { InterviewQuestion } from "@/types/interview"
import { codeExecutor, type CodeExecutionResult } from "@/lib/code-executor"

// Helper function to format test results nicely
function formatTestResults(testResults: Array<{
  input: any
  expected: any
  actual: any
  passed: boolean
}>, summary: string): string {
  const passedCount = testResults.filter(t => t.passed).length
  const totalCount = testResults.length
  const status = passedCount === totalCount ? "✅" : "❌"
  
  let output = `${status} Test Results: ${summary}\n`
  output += "=" + "=".repeat(50) + "\n"
  
  // Add summary statistics
  const passRate = Math.round((passedCount / totalCount) * 100)
  output += `📊 Summary: ${passedCount} passed, ${totalCount - passedCount} failed (${passRate}% success rate)\n`
  output += "=" + "=".repeat(50) + "\n\n"
  
  testResults.forEach((test, index) => {
    const testNumber = index + 1
    const statusIcon = test.passed ? "✅" : "❌"
    
    output += `${statusIcon} Test ${testNumber}:\n`
    output += `   Input:    ${formatValue(test.input)}\n`
    output += `   Expected: ${formatValue(test.expected)}\n`
    output += `   Actual:   ${formatValue(test.actual)}\n`
    
    if (!test.passed) {
      const errorIcon = test.actual.toString().startsWith('Error:') ? '💥' : '⚠️'
      output += `   ${errorIcon}  FAILED\n`
    } else {
      output += `   🎉 PASSED\n`
    }
    output += "\n"
  })
  
  // Add final status
  if (passedCount === totalCount) {
    output += "🎉 All tests passed! Great job!\n"
  } else {
    output += `❌ ${totalCount - passedCount} test(s) failed. Check your logic and try again.\n`
  }
  
  return output
}

// Helper function to format values nicely
function formatValue(value: any): string {
  if (value === null) return "null"
  if (value === undefined) return "undefined"
  if (typeof value === "string") return `"${value}"`
  if (typeof value === "boolean") return value ? "true" : "false"
  if (Array.isArray(value)) {
    if (value.length === 0) return "[]"
    if (value.length <= 5) {
      return `[${value.map(formatValue).join(", ")}]`
    } else {
      return `[${value.slice(0, 3).map(formatValue).join(", ")}, ... (${value.length} items)]`
    }
  }
  if (typeof value === "object") {
    const keys = Object.keys(value)
    if (keys.length === 0) return "{}"
    if (keys.length <= 3) {
      return `{${keys.map(k => `${k}: ${formatValue(value[k])}`).join(", ")}}`
    } else {
      return `{${keys.slice(0, 2).map(k => `${k}: ${formatValue(value[k])}`).join(", ")}, ... (${keys.length} keys)}`
    }
  }
  return String(value)
}

const LANGUAGE_PRESETS: Record<string, { monacoLang: string }> = {
  python: {
    monacoLang: "python",
  },
  javascript: {
    monacoLang: "javascript",
  },
  typescript: {
    monacoLang: "typescript",
  },
}

// Function to generate appropriate template based on question and language
function generateTemplate(language: string, question?: InterviewQuestion): string {
  if (!question) {
    // Default templates if no question provided
    switch (language) {
      case "python":
        return `def solution(arr):\n  # Write your solution here\n  pass`
      case "javascript":
        return `function solution(arr) {\n  // Write your solution here\n}`
      case "typescript":
        return `function solution(arr: number[]): number[] {\n  // Write your solution here\n}`
      default:
        return `def solution(arr):\n  # Write your solution here\n  pass`
    }
  }

  // Analyze question to determine appropriate template
  const questionText = question.question.toLowerCase()
  
  // Two Sum problem
  if (questionText.includes("two numbers that add up") || questionText.includes("target")) {
    switch (language) {
      case "python":
        return `def solution(nums, target):\n  # Given an array of integers nums and an integer target,\n  # return indices of the two numbers such that they add up to target.\n  # You may assume that each input would have exactly one solution.\n  \n  # Write your solution here\n  pass`
      case "javascript":
        return `function solution(nums, target) {\n  // Given an array of integers nums and an integer target,\n  // return indices of the two numbers such that they add up to target.\n  // You may assume that each input would have exactly one solution.\n  \n  // Write your solution here\n}`
      case "typescript":
        return `function solution(nums: number[], target: number): number[] {\n  // Given an array of integers nums and an integer target,\n  // return indices of the two numbers such that they add up to target.\n  // You may assume that each input would have exactly one solution.\n  \n  // Write your solution here\n}`
    }
  }
  
  // Reverse Linked List
  if (questionText.includes("reverse") && questionText.includes("linked list")) {
    switch (language) {
      case "python":
        return `def solution(head):\n  # Given the head of a singly linked list, reverse the list and return the reversed list.\n  \n  # Write your solution here\n  pass`
      case "javascript":
        return `function solution(head) {\n  // Given the head of a singly linked list, reverse the list and return the reversed list.\n  \n  // Write your solution here\n}`
      case "typescript":
        return `function solution(head: ListNode | null): ListNode | null {\n  // Given the head of a singly linked list, reverse the list and return the reversed list.\n  \n  // Write your solution here\n}`
    }
  }
  
  // Valid BST
  if (questionText.includes("valid") && questionText.includes("binary search tree")) {
    switch (language) {
      case "python":
        return `def solution(root):\n  # Given the root of a binary tree, determine if it is a valid binary search tree.\n  \n  # Write your solution here\n  pass`
      case "javascript":
        return `function solution(root) {\n  // Given the root of a binary tree, determine if it is a valid binary search tree.\n  \n  // Write your solution here\n}`
      case "typescript":
        return `function solution(root: TreeNode | null): boolean {\n  // Given the root of a binary tree, determine if it is a valid binary search tree.\n  \n  // Write your solution here\n}`
    }
  }
  
  // Longest Substring Without Repeating Characters
  if (questionText.includes("longest substring") && questionText.includes("repeating")) {
    switch (language) {
      case "python":
        return `def solution(s):\n  # Given a string s, find the length of the longest substring without repeating characters.\n  \n  # Write your solution here\n  pass`
      case "javascript":
        return `function solution(s) {\n  // Given a string s, find the length of the longest substring without repeating characters.\n  \n  // Write your solution here\n}`
      case "typescript":
        return `function solution(s: string): number {\n  // Given a string s, find the length of the longest substring without repeating characters.\n  \n  // Write your solution here\n}`
    }
  }
  
  // System Design questions
  if (questionText.includes("design") || questionText.includes("system")) {
    switch (language) {
      case "python":
        return `# System Design Question\n# This is a system design question. Please explain your approach,\n# discuss architecture, database design, and scalability considerations.\n\ndef solution():\n  # Write your analysis and approach here\n  pass`
      case "javascript":
        return `// System Design Question\n// This is a system design question. Please explain your approach,\n// discuss architecture, database design, and scalability considerations.\n\nfunction solution() {\n  // Write your analysis and approach here\n}`
      case "typescript":
        return `// System Design Question\n// This is a system design question. Please explain your approach,\n// discuss architecture, database design, and scalability considerations.\n\nfunction solution(): void {\n  // Write your analysis and approach here\n}`
    }
  }
  
  // Default fallback
  switch (language) {
    case "python":
      return `def solution(arr):\n  # Write your solution here\n  pass`
    case "javascript":
      return `function solution(arr) {\n  // Write your solution here\n}`
    case "typescript":
      return `function solution(arr: number[]): number[] {\n  // Write your solution here\n}`
    default:
      return `def solution(arr):\n  # Write your solution here\n  pass`
  }
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
  const [code, setCode] = useState<string>(generateTemplate(defaultLang, question))
  const [output, setOutput] = useState<string>("")
  const [isExecuting, setIsExecuting] = useState<boolean>(false)
  const [executionResult, setExecutionResult] = useState<CodeExecutionResult | null>(null)

  useEffect(() => {
    // Regenerate template when question changes
    setCode(generateTemplate(language, question))
    setOutput("")
    setExecutionResult(null)
  }, [question, language])

  const handleReset = () => {
    setCode(generateTemplate(language, question))
    setOutput("")
    setExecutionResult(null)
  }

  const runTests = async () => {
    setIsExecuting(true)
    setOutput("")
    setExecutionResult(null)

    try {
      // Validate code before execution
      const validation = codeExecutor.validateCode(code, language)
      if (!validation.valid) {
        setOutput(`Validation Error: ${validation.error}`)
        setIsExecuting(false)
        return
      }

      // Execute code using the code executor service
      const result = await codeExecutor.executeCode({
        code,
        language: language as "python" | "javascript" | "typescript",
        testCases: question?.sampleTests
      })

      setExecutionResult(result)
      
      if (result.success) {
        if (result.testResults && result.testResults.length > 0) {
          // Format test results for display
          const passedCount = result.testResults.filter(t => t.passed).length
          const totalCount = result.testResults.length
          const summary = `${passedCount}/${totalCount} tests passed`
          
          const formattedOutput = formatTestResults(result.testResults, summary)
          setOutput(formattedOutput)
        } else {
          setOutput(result.output)
        }
      } else {
        setOutput(`❌ Error: ${result.error || "Execution failed"}`)
      }

      // Call callbacks
      if (onCodeSubmit) {
        onCodeSubmit(code, result.success ? result.output : `Error: ${result.error}`)
      } else if (onRun) {
        onRun(code)
      }
    } catch (error) {
      const errorMessage = `Execution failed: ${error}`
      setOutput(errorMessage)
      if (onCodeSubmit) onCodeSubmit(code, errorMessage)
    } finally {
      setIsExecuting(false)
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
                setCode(generateTemplate(newLang, question))
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
            <Button size="sm" onClick={runTests} disabled={isExecuting}>
              {isExecuting ? (
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              ) : (
                <Play className="h-3 w-3 mr-1" />
              )}
              {isExecuting ? "Running..." : "Run Code"}
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

          <div className="mt-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium">Output</h4>
              {executionResult && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className={`px-2 py-1 rounded ${
                    executionResult.success 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {executionResult.success ? 'Success' : 'Error'}
                  </span>
                  <span>Executed in {executionResult.executionTime}ms</span>
                </div>
              )}
            </div>
            <div className="mt-2 p-4 bg-muted rounded text-sm overflow-auto min-h-[100px] font-mono">
              {isExecuting ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Executing code...</span>
                </div>
              ) : output ? (
                <pre className="whitespace-pre-wrap">{output}</pre>
              ) : (
                <div className="text-muted-foreground italic">
                  No output yet. Click 'Run Code' to execute your solution.
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
