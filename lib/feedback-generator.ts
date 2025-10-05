import { getGeminiClient } from "./gemini"
import { generateFallbackFeedback } from "./fallback-feedback"
import type { InterviewResponse, InterviewQuestion, FeedbackResult } from "@/types/interview"

// Helper to clean Gemini responses (removes ```json fences, trims whitespace)
function extractJson(text: string): string {
  return text.replace(/```json/g, "").replace(/```/g, "").trim()
}

export async function generateFeedback(
  question: InterviewQuestion,
  response: InterviewResponse,
): Promise<FeedbackResult> {
  // Check if response is a placeholder/sample text
  const isPlaceholder = response.transcript.includes("This is a sample transcript") || 
                       response.transcript.includes("Please configure ELEVENLABS_API_KEY") ||
                       response.transcript.trim().length < 10

  if (isPlaceholder) {
    console.log("[feedback] Skipping feedback generation for placeholder response:", response.transcript.substring(0, 50))
    return {
      questionId: question.id,
      responseId: response.questionId,
      score: 0,
      strengths: [],
      improvements: ["Please provide your actual response to this question"],
      detailedAnalysis: "No response was provided for this question. Please answer the question to receive feedback.",
      sentiment: "neutral",
      generatedAt: new Date(),
    }
  }

  // Check if Gemini API key is available
  const hasGeminiKey = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "your_gemini_api_key_here"
  
  if (!hasGeminiKey) {
    console.log("[feedback] No Gemini API key available, using fallback feedback system")
    return generateFallbackFeedback(question, response)
  }

  try {
    const gemini = getGeminiClient()
    const feedbackText = await gemini.evaluateResponse(
      question.question,
      response.transcript,
      question.type
    )

    console.log("Raw Gemini response:", feedbackText.substring(0, 200) + "...")

    try {
      const feedbackData = JSON.parse(extractJson(feedbackText))

      return {
        questionId: question.id,
        responseId: response.questionId,
        score: feedbackData.score ?? 0,
        strengths: feedbackData.strengths ?? [],
        improvements: feedbackData.improvements ?? [],
        detailedAnalysis: feedbackData.detailedAnalysis ?? "",
        sentiment: feedbackData.sentiment ?? "neutral",
        generatedAt: new Date(),
      }
    } catch (error) {
      console.error("[v0] Error parsing Gemini feedback:", error, "\nResponse snippet:", feedbackText.substring(0, 200))
      // Fall back to our fallback system if Gemini response is malformed
      return generateFallbackFeedback(question, response)
    }
  } catch (error) {
    console.error("[v0] Error calling Gemini API:", error)
    // Fall back to our fallback system if Gemini API fails
    return generateFallbackFeedback(question, response)
  }
}

export async function generateOverallFeedback(
  questions: InterviewQuestion[],
  responses: InterviewResponse[],
  feedbacks: FeedbackResult[],
): Promise<{
  overallScore: number
  summary: string
  keyStrengths: string[]
  areasForImprovement: string[]
}> {
  // Check if Gemini API key is available
  const hasGeminiKey = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "your_gemini_api_key_here"
  
  if (!hasGeminiKey) {
    console.log("[feedback] No Gemini API key available, using fallback overall feedback")
    return generateFallbackOverallFeedback(questions, responses, feedbacks)
  }

  try {
    const gemini = getGeminiClient()

    const prompt = `You are an expert interview coach. Analyze this complete interview session and provide overall feedback.

Interview Summary:
- Total Questions: ${questions.length}
- Questions Answered: ${responses.length}
- Individual Scores: ${feedbacks.map((f) => f.score).join(", ")}

Individual Feedback:
${feedbacks
  .map(
    (f, i) => `
Question ${i + 1}: ${questions.find((q) => q.id === f.questionId)?.question}
Score: ${f.score}/100
Strengths: ${f.strengths.join("; ")}
Improvements: ${f.improvements.join("; ")}
`,
  )
  .join("\n")}

Return ONLY a valid JSON object in this format, no extra text or markdown:
{
  "overallScore": <number 0-100>,
  "summary": "<2-3 paragraph overall assessment>",
  "keyStrengths": [<array of 3-4 key strengths across all responses>],
  "areasForImprovement": [<array of 3-4 key areas to improve>]
}`

    const response = await gemini.generateContent(prompt)
    console.log("Raw Gemini overall response:", response)

    const parsed = JSON.parse(extractJson(response))
    return parsed
  } catch (error) {
    console.error("[v0] Error generating overall feedback:", error)
    return generateFallbackOverallFeedback(questions, responses, feedbacks)
  }
}

function generateFallbackOverallFeedback(
  questions: InterviewQuestion[],
  responses: InterviewResponse[],
  feedbacks: FeedbackResult[],
): {
  overallScore: number
  summary: string
  keyStrengths: string[]
  areasForImprovement: string[]
} {
  const avgScore = feedbacks.reduce((sum, f) => sum + f.score, 0) / feedbacks.length
  const overallScore = Math.round(avgScore)

  // Collect all strengths and improvements
  const allStrengths = feedbacks.flatMap(f => f.strengths)
  const allImprovements = feedbacks.flatMap(f => f.improvements)

  // Get unique strengths and improvements
  const uniqueStrengths = [...new Set(allStrengths)]
  const uniqueImprovements = [...new Set(allImprovements)]

  // Select top strengths and improvements
  const keyStrengths = uniqueStrengths.slice(0, 4)
  const areasForImprovement = uniqueImprovements.slice(0, 4)

  let summary = `You completed ${responses.length} out of ${questions.length} questions with an average score of ${overallScore}/100. `
  
  if (overallScore >= 80) {
    summary += "Excellent performance! Your responses demonstrate strong interview skills and clear communication. "
  } else if (overallScore >= 60) {
    summary += "Good performance with room for improvement. Your responses show understanding but could benefit from more structure. "
  } else {
    summary += "There's significant room for improvement in your interview responses. Focus on providing more detailed examples and structure. "
  }

  summary += "Continue practicing to refine your interview skills and build confidence in your responses."

  return {
    overallScore,
    summary,
    keyStrengths: keyStrengths.length > 0 ? keyStrengths : [
      "Completed the interview questions",
      "Provided responses to all questions",
      "Demonstrated effort and engagement"
    ],
    areasForImprovement: areasForImprovement.length > 0 ? areasForImprovement : [
      "Add more specific examples and details",
      "Use the STAR method for behavioral questions",
      "Include quantifiable results and metrics",
      "Practice structuring responses more clearly"
    ],
  }
}
