  // Gemini API integration for question generation and feedback

  interface GeminiMessage {
    role: "user" | "model"
    parts: { text: string }[]
  }

  interface GeminiResponse {
    candidates: {
      content: {
        parts: { text: string }[]
      }
    }[]
  }

  export class GeminiClient {
    private apiKey: string
    private baseUrl = "https://generativelanguage.googleapis.com/v1beta"

    constructor(apiKey: string) {
      this.apiKey = apiKey
    }

    async generateContent(prompt: string, model = "gemini-2.5-flash"): Promise<string> {
      try {
        const response = await fetch(`${this.baseUrl}/models/${model}:generateContent?key=${this.apiKey}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 2048,
            },
          }),
        })

        if (!response.ok) {
          throw new Error(`Gemini API error: ${response.statusText}`)
        }

        const data: GeminiResponse = await response.json()
        return data.candidates[0]?.content?.parts[0]?.text || ""
      } catch (error) {
        console.error("[v0] Gemini API error:", error)
        throw error
      }
    }

    async generateInterviewQuestions(type: "behavioral" | "technical", count = 5): Promise<string> {
      const prompt =
        type === "behavioral"
          ? `Generate ${count} behavioral interview questions for a professional job interview. 
      
      For each question, provide:
      - The question text
      - A category (e.g., Teamwork, Leadership, Problem Solving, Communication, Time Management)
      - A difficulty level (easy, medium, or hard)
      
      Format the response as a JSON array with this structure:
      [
        {
          "question": "question text here",
          "category": "category name",
          "difficulty": "medium"
        }
      ]
      
      Make the questions realistic and commonly asked in professional interviews. Focus on STAR method compatible questions.`
          : `Generate ${count} technical interview questions for a software engineering interview.
      
      For each question, provide:
      - The question text (algorithm or data structure problem)
      - A category (e.g., Arrays, Strings, Trees, Dynamic Programming, System Design)
      - A difficulty level (easy, medium, or hard)
      
      Format the response as a JSON array with this structure:
      [
        {
          "question": "question text here",
          "category": "category name",
          "difficulty": "medium"
        }
      ]
      
      Make the questions realistic and similar to those asked at top tech companies.`

      return this.generateContent(prompt)
    }

    async evaluateResponse(question: string, response: string, type: "behavioral" | "technical"): Promise<string> {
      const prompt =
        type === "behavioral"
          ? `You are an expert interview coach. Evaluate this behavioral interview response.

      Question: ${question}
      
      Candidate's Response: ${response}
      
      Provide a detailed evaluation in JSON format with:
      {
        "score": <number 0-100>,
        "strengths": [<array of 2-3 specific strengths>],
        "improvements": [<array of 2-3 specific areas to improve>],
        "detailedAnalysis": "<2-3 paragraph detailed analysis>",
        "sentiment": "<positive, neutral, or negative>"
      }
      
      Evaluate based on:
      - STAR method usage (Situation, Task, Action, Result)
      - Clarity and structure
      - Specific examples and details
      - Relevance to the question
      - Communication effectiveness`
          : `You are an expert technical interviewer. Evaluate this technical interview response.

      Question: ${question}
      
      Candidate's Response: ${response}
      
      Provide a detailed evaluation in JSON format with:
      {
        "score": <number 0-100>,
        "strengths": [<array of 2-3 specific strengths>],
        "improvements": [<array of 2-3 specific areas to improve>],
        "detailedAnalysis": "<2-3 paragraph detailed analysis>",
        "sentiment": "<positive, neutral, or negative>"
      }
      
      Evaluate based on:
      - Problem understanding
      - Solution approach and algorithm choice
      - Code quality and correctness
      - Time and space complexity analysis
      - Edge case handling
      - Communication of thought process`

      return this.generateContent(prompt)
    }
  }

  // Singleton instance
  let geminiClient: GeminiClient | null = null

  export function getGeminiClient(): GeminiClient {
    if (!geminiClient) {
      const apiKey = process.env.GEMINI_API_KEY
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable is not set")
      }
      geminiClient = new GeminiClient(apiKey)
    }
    return geminiClient
  }
