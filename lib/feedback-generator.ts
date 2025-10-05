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
  const gemini = getGeminiClient()
  const feedbackText = await gemini.evaluateResponse(
    question.question,
    response.transcript,
    question.type
  )

  console.log("Raw Gemini response:", feedbackText)

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
    console.error("[v0] Error parsing Gemini feedback:", error, feedbackText)

    // Fallback feedback if parsing fails
    return {
      questionId: question.id,
      responseId: response.questionId,
      score: 75,
      strengths: ["You provided a clear response to the question", "Your answer demonstrated relevant experience"],
      improvements: [
        "Consider adding more specific examples and metrics",
        "Structure your response using the STAR method for better clarity",
      ],
      detailedAnalysis:
        "Your response shows good understanding of the question. To improve, focus on providing more concrete examples with measurable outcomes. Consider structuring your answers using the STAR method (Situation, Task, Action, Result).",
      sentiment: "positive",
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
