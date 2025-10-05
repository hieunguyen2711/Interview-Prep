import { NextRequest, NextResponse } from "next/server"
import { spawn } from "child_process"
import { writeFile, unlink, mkdtemp } from "fs/promises"
import { join } from "path"
import { tmpdir } from "os"

interface CodeExecutionRequest {
  code: string
  language: "python" | "javascript" | "typescript"
  testCases?: { input: string; expected: string }[]
}

interface CodeExecutionResult {
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

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const { code, language, testCases }: CodeExecutionRequest = await request.json()

    if (!code || !language) {
      return NextResponse.json(
        { error: "Code and language are required" },
        { status: 400 }
      )
    }

    // Security: Basic code validation
    if (containsDangerousCode(code)) {
      return NextResponse.json(
        { error: "Code contains potentially dangerous operations" },
        { status: 400 }
      )
    }

    let result: CodeExecutionResult

    switch (language) {
      case "python":
        result = await executePython(code, testCases)
        break
      case "javascript":
        result = await executeJavaScript(code, testCases)
        break
      case "typescript":
        result = await executeTypeScript(code, testCases)
        break
      default:
        return NextResponse.json(
          { error: "Unsupported language" },
          { status: 400 }
        )
    }

    result.executionTime = Date.now() - startTime

    return NextResponse.json(result)
  } catch (error) {
    console.error("Code execution error:", error)
    return NextResponse.json(
      { 
        error: "Internal server error",
        success: false,
        output: "",
        executionTime: Date.now() - startTime
      },
      { status: 500 }
    )
  }
}

function containsDangerousCode(code: string): boolean {
  const dangerousPatterns = [
    /import\s+os/,
    /import\s+subprocess/,
    /import\s+sys/,
    /__import__/,
    /eval\s*\(/,
    /exec\s*\(/,
    /open\s*\(/,
    /file\s*\(/,
    /input\s*\(/,
    /raw_input\s*\(/,
    /process\./,
    /require\s*\(\s*['"]fs['"]/,
    /require\s*\(\s*['"]child_process['"]/,
    /require\s*\(\s*['"]os['"]/,
  ]

  return dangerousPatterns.some(pattern => pattern.test(code))
}

async function executePython(code: string, testCases?: { input: string; expected: string }[]): Promise<CodeExecutionResult> {
  const startTime = Date.now()
  const tempDir = await mkdtemp(join(tmpdir(), "python-exec-"))
  const codeFile = join(tempDir, "solution.py")
  
  try {
    // Wrap the code to handle test cases
    const wrappedCode = wrapPythonCode(code, testCases)
    await writeFile(codeFile, wrappedCode)

    return new Promise((resolve) => {
      const python = spawn("python3", [codeFile], {
        timeout: 10000, // 10 second timeout
        stdio: ["pipe", "pipe", "pipe"]
      })

      let output = ""
      let error = ""

      python.stdout.on("data", (data) => {
        output += data.toString()
      })

      python.stderr.on("data", (data) => {
        error += data.toString()
      })

      python.on("close", (code) => {
        unlink(codeFile).catch(console.error)
        
        resolve({
          success: code === 0,
          output: output.trim(),
          error: error.trim() || undefined,
          testResults: testCases ? parseTestResults(output) : undefined,
          executionTime: Date.now() - startTime
        })
      })

      python.on("error", (err) => {
        resolve({
          success: false,
          output: "",
          error: `Failed to execute Python: ${err.message}`,
          executionTime: Date.now() - startTime
        })
      })
    })
  } catch (error) {
    return {
      success: false,
      output: "",
      error: `Python execution error: ${error}`,
      executionTime: Date.now() - startTime
    }
  }
}

async function executeJavaScript(code: string, testCases?: { input: string; expected: string }[]): Promise<CodeExecutionResult> {
  const startTime = Date.now()
  const tempDir = await mkdtemp(join(tmpdir(), "js-exec-"))
  const codeFile = join(tempDir, "solution.js")
  
  try {
    const wrappedCode = wrapJavaScriptCode(code, testCases)
    await writeFile(codeFile, wrappedCode)

    return new Promise((resolve) => {
      const node = spawn("node", [codeFile], {
        timeout: 10000,
        stdio: ["pipe", "pipe", "pipe"]
      })

      let output = ""
      let error = ""

      node.stdout.on("data", (data) => {
        output += data.toString()
      })

      node.stderr.on("data", (data) => {
        error += data.toString()
      })

      node.on("close", (code) => {
        unlink(codeFile).catch(console.error)
        
        resolve({
          success: code === 0,
          output: output.trim(),
          error: error.trim() || undefined,
          testResults: testCases ? parseTestResults(output) : undefined,
          executionTime: Date.now() - startTime
        })
      })

      node.on("error", (err) => {
        resolve({
          success: false,
          output: "",
          error: `Failed to execute JavaScript: ${err.message}`,
          executionTime: Date.now() - startTime
        })
      })
    })
  } catch (error) {
    return {
      success: false,
      output: "",
      error: `JavaScript execution error: ${error}`,
      executionTime: Date.now() - startTime
    }
  }
}

async function executeTypeScript(code: string, testCases?: { input: string; expected: string }[]): Promise<CodeExecutionResult> {
  const startTime = Date.now()
  const tempDir = await mkdtemp(join(tmpdir(), "ts-exec-"))
  const tsFile = join(tempDir, "solution.ts")
  const jsFile = join(tempDir, "solution.js")
  
  try {
    const wrappedCode = wrapTypeScriptCode(code, testCases)
    await writeFile(tsFile, wrappedCode)

    // Compile TypeScript to JavaScript
    const tsc = spawn("npx", ["tsc", tsFile, "--outFile", jsFile, "--target", "es2020"], {
      timeout: 5000,
      stdio: ["pipe", "pipe", "pipe"]
    })

    return new Promise((resolve) => {
      let compileError = ""

      tsc.stderr.on("data", (data) => {
        compileError += data.toString()
      })

      tsc.on("close", (compileCode) => {
        if (compileCode !== 0) {
          resolve({
            success: false,
            output: "",
            error: `TypeScript compilation error: ${compileError}`,
            executionTime: Date.now() - startTime
          })
          return
        }

        // Execute the compiled JavaScript
        const node = spawn("node", [jsFile], {
          timeout: 10000,
          stdio: ["pipe", "pipe", "pipe"]
        })

        let output = ""
        let error = ""

        node.stdout.on("data", (data) => {
          output += data.toString()
        })

        node.stderr.on("data", (data) => {
          error += data.toString()
        })

        node.on("close", (code) => {
          unlink(tsFile).catch(console.error)
          unlink(jsFile).catch(console.error)
          
          resolve({
            success: code === 0,
            output: output.trim(),
            error: error.trim() || undefined,
            testResults: testCases ? parseTestResults(output) : undefined,
            executionTime: Date.now() - startTime
          })
        })

        node.on("error", (err) => {
          resolve({
            success: false,
            output: "",
            error: `Failed to execute TypeScript: ${err.message}`,
            executionTime: Date.now() - startTime
          })
        })
      })
    })
  } catch (error) {
    return {
      success: false,
      output: "",
      error: `TypeScript execution error: ${error}`,
      executionTime: Date.now() - startTime
    }
  }
}

function wrapPythonCode(code: string, testCases?: { input: string; expected: string }[]): string {
  let wrapped = code + "\n\n"

  if (testCases && testCases.length > 0) {
    wrapped += "import json\n"
    wrapped += "import sys\n"
    wrapped += "import inspect\n\n"
    
    // Add ListNode class for linked list problems
    wrapped += "class ListNode:\n"
    wrapped += "    def __init__(self, val=0, next=None):\n"
    wrapped += "        self.val = val\n"
    wrapped += "        self.next = next\n"
    wrapped += "    \n"
    wrapped += "    def __repr__(self):\n"
    wrapped += "        return f'ListNode({self.val})'\n"
    wrapped += "    \n"
    wrapped += "    def to_list(self):\n"
    wrapped += "        result = []\n"
    wrapped += "        current = self\n"
    wrapped += "        while current:\n"
    wrapped += "            result.append(current.val)\n"
    wrapped += "            current = current.next\n"
    wrapped += "        return result\n\n"
    
    // Add helper function to create linked list from array
    wrapped += "def create_linked_list(arr):\n"
    wrapped += "    if not arr:\n"
    wrapped += "        return None\n"
    wrapped += "    head = ListNode(arr[0])\n"
    wrapped += "    current = head\n"
    wrapped += "    for val in arr[1:]:\n"
    wrapped += "        current.next = ListNode(val)\n"
    wrapped += "        current = current.next\n"
    wrapped += "    return head\n\n"
    
    wrapped += "def run_tests():\n"
    wrapped += "    results = []\n"
    wrapped += "    # Get function signature to determine how many parameters it expects\n"
    wrapped += "    sig = inspect.signature(solution)\n"
    wrapped += "    param_count = len(sig.parameters)\n\n"
    
    testCases.forEach((testCase, index) => {
      wrapped += `    # Test case ${index + 1}\n`
      wrapped += `    test_index = ${index + 1}\n`
      wrapped += `    try:\n`
      wrapped += `        input_data = ${testCase.input}\n`
      wrapped += `        expected = ${testCase.expected}\n`
      wrapped += `        \n`
      wrapped += `        # Call solution with appropriate number of arguments\n`
      wrapped += `        if param_count == 1:\n`
      wrapped += `            # Check if this is a linked list problem (single parameter, list input)\n`
      wrapped += `            if isinstance(input_data, list) and len(input_data) == 1 and isinstance(input_data[0], list):\n`
      wrapped += `                # Convert array to linked list\n`
      wrapped += `                linked_list = create_linked_list(input_data[0])\n`
      wrapped += `                actual = solution(linked_list)\n`
      wrapped += `                # Convert result back to list for comparison\n`
      wrapped += `                if actual and hasattr(actual, 'to_list'):\n`
      wrapped += `                    actual = actual.to_list()\n`
      wrapped += `                elif actual is None:\n`
      wrapped += `                    actual = []\n`
      wrapped += `            else:\n`
      wrapped += `                actual = solution(input_data)\n`
      wrapped += `        elif param_count == 2 and isinstance(input_data, list) and len(input_data) == 2:\n`
      wrapped += `            actual = solution(input_data[0], input_data[1])\n`
      wrapped += `        elif param_count == 3 and isinstance(input_data, list) and len(input_data) == 3:\n`
      wrapped += `            actual = solution(input_data[0], input_data[1], input_data[2])\n`
      wrapped += `        else:\n`
      wrapped += `            # Fallback: try to unpack if it's a list\n`
      wrapped += `            if isinstance(input_data, list):\n`
      wrapped += `                actual = solution(*input_data)\n`
      wrapped += `            else:\n`
      wrapped += `                actual = solution(input_data)\n`
      wrapped += `        \n`
      wrapped += `        passed = json.dumps(actual, sort_keys=True) == json.dumps(expected, sort_keys=True)\n`
      wrapped += `        results.append({\n`
      wrapped += `            "input": input_data,\n`
      wrapped += `            "expected": expected,\n`
      wrapped += `            "actual": actual,\n`
      wrapped += `            "passed": passed\n`
      wrapped += `        })\n`
      wrapped += `        print(f"Test {test_index}: {'PASS' if passed else 'FAIL'}")\n`
      wrapped += `    except Exception as e:\n`
      wrapped += `        results.append({\n`
      wrapped += `            "input": ${testCase.input},\n`
      wrapped += `            "expected": ${testCase.expected},\n`
      wrapped += `            "actual": f"Error: {str(e)}",\n`
      wrapped += `            "passed": False\n`
      wrapped += `        })\n`
      wrapped += `        print(f"Test {test_index}: ERROR - {str(e)}")\n\n`
    })
    
    wrapped += "    print('\\n' + json.dumps(results, indent=2))\n"
    wrapped += "    return results\n\n"
    
    wrapped += "if __name__ == '__main__':\n"
    wrapped += "    run_tests()\n"
  } else {
    wrapped += "if __name__ == '__main__':\n"
    wrapped += "    # Demo execution\n"
    wrapped += "    try:\n"
    wrapped += "        result = solution([1, 2, 3])\n"
    wrapped += "        print(f'Result: {result}')\n"
    wrapped += "    except Exception as e:\n"
    wrapped += "        print(f'Error: {e}')\n"
  }

  return wrapped
}

function wrapJavaScriptCode(code: string, testCases?: { input: string; expected: string }[]): string {
  let wrapped = code + "\n\n"

  if (testCases && testCases.length > 0) {
    // Add ListNode class for linked list problems
    wrapped += "class ListNode {\n"
    wrapped += "    constructor(val = 0, next = null) {\n"
    wrapped += "        this.val = val;\n"
    wrapped += "        this.next = next;\n"
    wrapped += "    }\n"
    wrapped += "    \n"
    wrapped += "    toList() {\n"
    wrapped += "        const result = [];\n"
    wrapped += "        let current = this;\n"
    wrapped += "        while (current) {\n"
    wrapped += "            result.push(current.val);\n"
    wrapped += "            current = current.next;\n"
    wrapped += "        }\n"
    wrapped += "        return result;\n"
    wrapped += "    }\n"
    wrapped += "}\n\n"
    
    // Add helper function to create linked list from array
    wrapped += "function createLinkedList(arr) {\n"
    wrapped += "    if (!arr || arr.length === 0) return null;\n"
    wrapped += "    const head = new ListNode(arr[0]);\n"
    wrapped += "    let current = head;\n"
    wrapped += "    for (let i = 1; i < arr.length; i++) {\n"
    wrapped += "        current.next = new ListNode(arr[i]);\n"
    wrapped += "        current = current.next;\n"
    wrapped += "    }\n"
    wrapped += "    return head;\n"
    wrapped += "}\n\n"
    
    wrapped += "function runTests() {\n"
    wrapped += "    const results = [];\n"
    
    testCases.forEach((testCase, index) => {
      wrapped += `    // Test case ${index + 1}\n`
      wrapped += `    {\n`
      wrapped += `        const testIndex = ${index + 1};\n`
      wrapped += `        try {\n`
      wrapped += `            const inputData = ${testCase.input};\n`
      wrapped += `            const expected = ${testCase.expected};\n`
      wrapped += `            \n`
      wrapped += `            // Call solution with appropriate number of arguments\n`
      wrapped += `            let actual;\n`
      wrapped += `            if (Array.isArray(inputData) && inputData.length === 1 && Array.isArray(inputData[0])) {\n`
      wrapped += `                // Check if this is a linked list problem (single parameter, nested array)\n`
      wrapped += `                const linkedList = createLinkedList(inputData[0]);\n`
      wrapped += `                actual = solution(linkedList);\n`
      wrapped += `                // Convert result back to array for comparison\n`
      wrapped += `                if (actual && typeof actual.toList === 'function') {\n`
      wrapped += `                    actual = actual.toList();\n`
      wrapped += `                } else if (actual === null) {\n`
      wrapped += `                    actual = [];\n`
      wrapped += `                }\n`
      wrapped += `            } else if (Array.isArray(inputData) && inputData.length === 2) {\n`
      wrapped += `                actual = solution(inputData[0], inputData[1]);\n`
      wrapped += `            } else if (Array.isArray(inputData) && inputData.length === 3) {\n`
      wrapped += `                actual = solution(inputData[0], inputData[1], inputData[2]);\n`
      wrapped += `            } else if (Array.isArray(inputData)) {\n`
      wrapped += `                actual = solution(...inputData);\n`
      wrapped += `            } else {\n`
      wrapped += `                actual = solution(inputData);\n`
      wrapped += `            }\n`
      wrapped += `            \n`
      wrapped += `            const passed = JSON.stringify(actual) === JSON.stringify(expected);\n`
      wrapped += `            results.push({\n`
      wrapped += `                input: inputData,\n`
      wrapped += `                expected: expected,\n`
      wrapped += `                actual: actual,\n`
      wrapped += `                passed: passed\n`
      wrapped += `            });\n`
      wrapped += `            console.log(\`Test \${testIndex}: \${passed ? 'PASS' : 'FAIL'}\`);\n`
      wrapped += `        } catch (error) {\n`
      wrapped += `            results.push({\n`
      wrapped += `                input: ${testCase.input},\n`
      wrapped += `                expected: ${testCase.expected},\n`
      wrapped += `                actual: \`Error: \${error.message}\`,\n`
      wrapped += `                passed: false\n`
      wrapped += `            });\n`
      wrapped += `            console.log(\`Test \${testIndex}: ERROR - \${error.message}\`);\n`
      wrapped += `        }\n`
      wrapped += `    }\n\n`
    })
    
    wrapped += "    console.log('\\n' + JSON.stringify(results, null, 2));\n"
    wrapped += "    return results;\n"
    wrapped += "}\n\n"
    
    wrapped += "runTests();\n"
  } else {
    wrapped += "// Demo execution\n"
    wrapped += "try {\n"
    wrapped += "    const result = solution([1, 2, 3]);\n"
    wrapped += "    console.log(`Result: ${result}`);\n"
    wrapped += "} catch (error) {\n"
    wrapped += "    console.log(`Error: ${error.message}`);\n"
    wrapped += "}\n"
  }

  return wrapped
}

function wrapTypeScriptCode(code: string, testCases?: { input: string; expected: string }[]): string {
  // Similar to JavaScript but with TypeScript types
  let wrapped = code + "\n\n"

  if (testCases && testCases.length > 0) {
    // Add ListNode class for linked list problems
    wrapped += "class ListNode {\n"
    wrapped += "    val: number;\n"
    wrapped += "    next: ListNode | null;\n"
    wrapped += "    constructor(val: number = 0, next: ListNode | null = null) {\n"
    wrapped += "        this.val = val;\n"
    wrapped += "        this.next = next;\n"
    wrapped += "    }\n"
    wrapped += "    \n"
    wrapped += "    toList(): number[] {\n"
    wrapped += "        const result: number[] = [];\n"
    wrapped += "        let current: ListNode | null = this;\n"
    wrapped += "        while (current) {\n"
    wrapped += "            result.push(current.val);\n"
    wrapped += "            current = current.next;\n"
    wrapped += "        }\n"
    wrapped += "        return result;\n"
    wrapped += "    }\n"
    wrapped += "}\n\n"
    
    // Add helper function to create linked list from array
    wrapped += "function createLinkedList(arr: number[]): ListNode | null {\n"
    wrapped += "    if (!arr || arr.length === 0) return null;\n"
    wrapped += "    const head = new ListNode(arr[0]);\n"
    wrapped += "    let current = head;\n"
    wrapped += "    for (let i = 1; i < arr.length; i++) {\n"
    wrapped += "        current.next = new ListNode(arr[i]);\n"
    wrapped += "        current = current.next;\n"
    wrapped += "    }\n"
    wrapped += "    return head;\n"
    wrapped += "}\n\n"
    
    wrapped += "function runTests(): void {\n"
    wrapped += "    const results: any[] = [];\n"
    
    testCases.forEach((testCase, index) => {
      wrapped += `    // Test case ${index + 1}\n`
      wrapped += `    {\n`
      wrapped += `        const testIndex = ${index + 1};\n`
      wrapped += `        try {\n`
      wrapped += `            const inputData = ${testCase.input};\n`
      wrapped += `            const expected = ${testCase.expected};\n`
      wrapped += `            \n`
      wrapped += `            // Call solution with appropriate number of arguments\n`
      wrapped += `            let actual: any;\n`
      wrapped += `            if (Array.isArray(inputData) && inputData.length === 1 && Array.isArray(inputData[0])) {\n`
      wrapped += `                // Check if this is a linked list problem (single parameter, nested array)\n`
      wrapped += `                const linkedList = createLinkedList(inputData[0]);\n`
      wrapped += `                actual = solution(linkedList);\n`
      wrapped += `                // Convert result back to array for comparison\n`
      wrapped += `                if (actual && typeof actual.toList === 'function') {\n`
      wrapped += `                    actual = actual.toList();\n`
      wrapped += `                } else if (actual === null) {\n`
      wrapped += `                    actual = [];\n`
      wrapped += `                }\n`
      wrapped += `            } else if (Array.isArray(inputData) && inputData.length === 2) {\n`
      wrapped += `                actual = solution(inputData[0], inputData[1]);\n`
      wrapped += `            } else if (Array.isArray(inputData) && inputData.length === 3) {\n`
      wrapped += `                actual = solution(inputData[0], inputData[1], inputData[2]);\n`
      wrapped += `            } else if (Array.isArray(inputData)) {\n`
      wrapped += `                actual = solution(...inputData);\n`
      wrapped += `            } else {\n`
      wrapped += `                actual = solution(inputData);\n`
      wrapped += `            }\n`
      wrapped += `            \n`
      wrapped += `            const passed = JSON.stringify(actual) === JSON.stringify(expected);\n`
      wrapped += `            results.push({\n`
      wrapped += `                input: inputData,\n`
      wrapped += `                expected: expected,\n`
      wrapped += `                actual: actual,\n`
      wrapped += `                passed: passed\n`
      wrapped += `            });\n`
      wrapped += `            console.log(\`Test \${testIndex}: \${passed ? 'PASS' : 'FAIL'}\`);\n`
      wrapped += `        } catch (error: any) {\n`
      wrapped += `            results.push({\n`
      wrapped += `                input: ${testCase.input},\n`
      wrapped += `                expected: ${testCase.expected},\n`
      wrapped += `                actual: \`Error: \${error.message}\`,\n`
      wrapped += `                passed: false\n`
      wrapped += `            });\n`
      wrapped += `            console.log(\`Test \${testIndex}: ERROR - \${error.message}\`);\n`
      wrapped += `        }\n`
      wrapped += `    }\n\n`
    })
    
    wrapped += "    console.log('\\n' + JSON.stringify(results, null, 2));\n"
    wrapped += "}\n\n"
    
    wrapped += "runTests();\n"
  } else {
    wrapped += "// Demo execution\n"
    wrapped += "try {\n"
    wrapped += "    const result = solution([1, 2, 3]);\n"
    wrapped += "    console.log(`Result: ${result}`);\n"
    wrapped += "} catch (error: any) {\n"
    wrapped += "    console.log(`Error: ${error.message}`);\n"
    wrapped += "}\n"
  }

  return wrapped
}

function parseTestResults(output: string): Array<{
  input: any
  expected: any
  actual: any
  passed: boolean
}> {
  try {
    // Look for JSON in the output
    const jsonMatch = output.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
  } catch (error) {
    console.error("Failed to parse test results:", error)
  }
  
  return []
}
