// Code execution service for the interview app

export interface CodeExecutionRequest {
  code: string
  language: "python" | "javascript" | "typescript"
  testCases?: { input: string; expected: string }[]
}

export interface CodeExecutionResult {
  success: boolean
  output: string
  error?: string
  testResults?: Array<{
    input: any
    expected: any
    actual: any
    passed: boolean
  }>
  executionTime: number
}

export class CodeExecutor {
  private static instance: CodeExecutor
  private executionTimeout = 10000 // 10 seconds

  static getInstance(): CodeExecutor {
    if (!CodeExecutor.instance) {
      CodeExecutor.instance = new CodeExecutor()
    }
    return CodeExecutor.instance
  }

  async executeCode(request: CodeExecutionRequest): Promise<CodeExecutionResult> {
    try {
      // For JavaScript/TypeScript, try client-side execution first
      if (request.language === "javascript" || request.language === "typescript") {
        const clientResult = this.executeClientSide(request)
        if (clientResult.success) {
          return clientResult
        }
      }

      // Fall back to server-side execution
      return await this.executeServerSide(request)
    } catch (error) {
      return {
        success: false,
        output: "",
        error: `Execution failed: ${error}`,
        executionTime: 0
      }
    }
  }

  private executeClientSide(request: CodeExecutionRequest): CodeExecutionResult {
    const startTime = Date.now()
    
    try {
      if (request.language === "javascript") {
        return this.executeJavaScriptClientSide(request, startTime)
      } else if (request.language === "typescript") {
        // For TypeScript, we'll compile it to JavaScript first
        const compiledCode = this.compileTypeScriptToJavaScript(request.code)
        const jsRequest = { ...request, code: compiledCode, language: "javascript" as const }
        return this.executeJavaScriptClientSide(jsRequest, startTime)
      }
      
      return {
        success: false,
        output: "",
        error: "Client-side execution not supported for this language",
        executionTime: Date.now() - startTime
      }
    } catch (error) {
      return {
        success: false,
        output: "",
        error: `Client-side execution error: ${error}`,
        executionTime: Date.now() - startTime
      }
    }
  }

  private executeJavaScriptClientSide(request: CodeExecutionRequest, startTime: number): CodeExecutionResult {
    try {
      // Create a function wrapper that returns the solution function
      // eslint-disable-next-line no-new-func
      const fn = new Function(`${request.code}\nreturn solution`)()
      
      if (typeof fn !== "function") {
        throw new Error("No solution function found")
      }

      if (request.testCases && request.testCases.length > 0) {
        const results = request.testCases.map((testCase, index) => {
          let parsedInput: any = null
          try {
            parsedInput = JSON.parse(testCase.input)
          } catch (e) {
            // fallback: treat as single primitive
            parsedInput = testCase.input
          }

          const actual = fn(parsedInput)
          const expected = (() => {
            try {
              return JSON.parse(testCase.expected)
            } catch (e) {
              return testCase.expected
            }
          })()

          const passed = JSON.stringify(actual) === JSON.stringify(expected)
          return { input: parsedInput, expected, actual, passed }
        })

        return {
          success: true,
          output: JSON.stringify(results, null, 2),
          testResults: results,
          executionTime: Date.now() - startTime
        }
      } else {
        // No test cases; just run the function with a demo input
        const demo = [1, 2, 3]
        const actual = fn(demo)
        return {
          success: true,
          output: String(actual),
          executionTime: Date.now() - startTime
        }
      }
    } catch (error: any) {
      return {
        success: false,
        output: "",
        error: error?.message || String(error),
        executionTime: Date.now() - startTime
      }
    }
  }

  private compileTypeScriptToJavaScript(tsCode: string): string {
    // Simple TypeScript to JavaScript conversion
    // This is a basic implementation - for production, you'd want to use the TypeScript compiler
    
    let jsCode = tsCode
    
    // Remove type annotations
    jsCode = jsCode.replace(/:\s*\w+(\[\])?/g, '')
    jsCode = jsCode.replace(/:\s*string/g, '')
    jsCode = jsCode.replace(/:\s*number/g, '')
    jsCode = jsCode.replace(/:\s*boolean/g, '')
    jsCode = jsCode.replace(/:\s*any/g, '')
    jsCode = jsCode.replace(/:\s*void/g, '')
    
    // Remove interface declarations
    jsCode = jsCode.replace(/interface\s+\w+\s*\{[^}]*\}/g, '')
    
    // Remove type imports
    jsCode = jsCode.replace(/import\s+type\s+.*?from\s+['"][^'"]*['"];?\s*/g, '')
    
    return jsCode
  }

  private async executeServerSide(request: CodeExecutionRequest): Promise<CodeExecutionResult> {
    const startTime = Date.now()
    
    try {
      const response = await fetch("/api/code/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        const errorData = await response.json()
        return {
          success: false,
          output: "",
          error: errorData.error || "Server execution failed",
          executionTime: Date.now() - startTime
        }
      }

      const result = await response.json()
      return {
        ...result,
        executionTime: Date.now() - startTime
      }
    } catch (error) {
      return {
        success: false,
        output: "",
        error: `Server execution error: ${error}`,
        executionTime: Date.now() - startTime
      }
    }
  }

  // Utility method to validate code before execution
  validateCode(code: string, language: string): { valid: boolean; error?: string } {
    if (!code.trim()) {
      return { valid: false, error: "Code cannot be empty" }
    }

    // Basic validation for different languages
    switch (language) {
      case "python":
        if (!code.includes("def solution")) {
          return { valid: false, error: "Python code must contain a 'solution' function" }
        }
        break
      case "javascript":
      case "typescript":
        if (!code.includes("function solution")) {
          return { valid: false, error: "JavaScript/TypeScript code must contain a 'solution' function" }
        }
        break
    }

    return { valid: true }
  }
}

// Export singleton instance
export const codeExecutor = CodeExecutor.getInstance()
