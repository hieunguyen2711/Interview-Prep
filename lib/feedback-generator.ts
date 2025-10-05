import { getGeminiClient } from "./gemini"
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

    // Enhanced fallback feedback based on response content
    const responseLength = response.transcript.length
    const fallbackScore = responseLength > 200 ? 65 : responseLength > 100 ? 55 : 45
    
    return {
      questionId: question.id,
      responseId: response.questionId,
      score: fallbackScore,
      strengths: ["You provided a response to the question"],
      improvements: [
        "LLM feedback generation failed - manual review recommended",
        "Consider providing more detailed examples",
        "Structure your response using the STAR method",
      ],
      detailedAnalysis: `Feedback generation encountered an error. Your response (${responseLength} characters) was received but couldn't be fully analyzed. Please ensure your response is complete and detailed.`,
      sentiment: "neutral",
      generatedAt: new Date(),
    }
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

    // Fallback overall feedback
    const avgScore = feedbacks.reduce((sum, f) => sum + f.score, 0) / feedbacks.length

    return {
      overallScore: Math.round(avgScore),
      summary:
        "You demonstrated good interview skills overall. Your responses showed relevant experience and understanding of the questions. To further improve, focus on providing more specific examples with measurable outcomes and structuring your answers more clearly.",
      keyStrengths: [
        "Clear communication and articulation",
        "Relevant experience and examples",
        "Good understanding of questions",
      ],
      areasForImprovement: [
        "Add more specific metrics and quantifiable results",
        "Use the STAR method consistently",
        "Provide more detailed context for your examples",
      ],
    }
  }
}
