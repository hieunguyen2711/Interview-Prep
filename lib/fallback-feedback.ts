// Fallback feedback system when Gemini API is not available
import type { InterviewQuestion, InterviewResponse, FeedbackResult } from "@/types/interview"

export function generateFallbackFeedback(
  question: InterviewQuestion,
  response: InterviewResponse,
): FeedbackResult {
  const transcript = response.transcript
  const responseLength = transcript.length
  const wordCount = transcript.split(/\s+/).length
  
  // Basic scoring based on response characteristics
  let score = 50 // Base score
  
  // Length scoring
  if (responseLength > 200) score += 20
  else if (responseLength > 100) score += 10
  else if (responseLength < 50) score -= 15
  
  // Word count scoring
  if (wordCount > 30) score += 15
  else if (wordCount > 15) score += 5
  else if (wordCount < 10) score -= 10
  
  // Content analysis
  const hasExamples = /example|instance|time when|situation|experience/i.test(transcript)
  const hasAction = /action|did|implemented|created|developed|managed/i.test(transcript)
  const hasResult = /result|outcome|success|improved|achieved|accomplished/i.test(transcript)
  const hasNumbers = /\d+/.test(transcript)
  
  if (hasExamples) score += 10
  if (hasAction) score += 10
  if (hasResult) score += 10
  if (hasNumbers) score += 5
  
  // Cap the score
  score = Math.min(100, Math.max(0, score))
  
  // Generate strengths and improvements
  const strengths: string[] = []
  const improvements: string[] = []
  
  if (responseLength > 150) {
    strengths.push("Provided a detailed response with good length")
  }
  
  if (hasExamples) {
    strengths.push("Included specific examples and experiences")
  }
  
  if (hasAction) {
    strengths.push("Described concrete actions taken")
  }
  
  if (hasResult) {
    strengths.push("Mentioned outcomes and results")
  }
  
  if (hasNumbers) {
    strengths.push("Used quantifiable metrics and data")
  }
  
  if (responseLength < 100) {
    improvements.push("Consider providing more detail and context")
  }
  
  if (!hasExamples) {
    improvements.push("Add specific examples to support your points")
  }
  
  if (!hasAction) {
    improvements.push("Describe the specific actions you took")
  }
  
  if (!hasResult) {
    improvements.push("Include the outcomes and results of your actions")
  }
  
  if (!hasNumbers) {
    improvements.push("Use metrics and quantifiable data when possible")
  }
  
  // Ensure we have at least some feedback
  if (strengths.length === 0) {
    strengths.push("You provided a response to the question")
  }
  
  if (improvements.length === 0) {
    improvements.push("Continue practicing to improve your interview skills")
  }
  
  // Generate detailed analysis
  const detailedAnalysis = generateDetailedAnalysis(question, transcript, score, strengths, improvements)
  
  // Determine sentiment
  let sentiment: "positive" | "neutral" | "negative" = "neutral"
  if (score >= 75) sentiment = "positive"
  else if (score < 50) sentiment = "negative"
  
  return {
    questionId: question.id,
    responseId: response.questionId,
    score,
    strengths,
    improvements,
    detailedAnalysis,
    sentiment,
    generatedAt: new Date(),
  }
}

function generateDetailedAnalysis(
  question: InterviewQuestion,
  transcript: string,
  score: number,
  strengths: string[],
  improvements: string[]
): string {
  const responseLength = transcript.length
  const wordCount = transcript.split(/\s+/).length
  
  let analysis = `Your response to "${question.question}" received a score of ${score}/100. `
  
  if (score >= 80) {
    analysis += "This is an excellent response that demonstrates strong interview skills. "
  } else if (score >= 60) {
    analysis += "This is a good response with room for improvement. "
  } else {
    analysis += "This response could benefit from more structure and detail. "
  }
  
  analysis += `Your answer was ${responseLength} characters long with ${wordCount} words. `
  
  if (strengths.length > 0) {
    analysis += `Key strengths include: ${strengths.join(", ")}. `
  }
  
  if (improvements.length > 0) {
    analysis += `Areas for improvement: ${improvements.join(", ")}. `
  }
  
  analysis += "For behavioral questions, consider using the STAR method (Situation, Task, Action, Result) to structure your responses more effectively."
  
  return analysis
}
