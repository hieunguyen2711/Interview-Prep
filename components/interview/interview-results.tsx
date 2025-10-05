"use client"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Home, Download, TrendingUp, TrendingDown, CheckCircle2, AlertCircle, Code } from "lucide-react"
import type { InterviewQuestion, InterviewResponse, FeedbackResult } from "@/types/interview"
import Link from "next/link"

interface InterviewResultsProps {
  sessionId: string
}

interface OverallFeedback {
  overallScore: number
  summary: string
  keyStrengths: string[]
  areasForImprovement: string[]
}

export function InterviewResults({ sessionId }: InterviewResultsProps) {
  const [questions, setQuestions] = useState<InterviewQuestion[]>([])
  const [responses, setResponses] = useState<InterviewResponse[]>([])
  const [feedbacks, setFeedbacks] = useState<FeedbackResult[]>([])
  const [overallFeedback, setOverallFeedback] = useState<OverallFeedback | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadResults()
  }, [sessionId])

  const loadResults = async () => {
    try {
      // Option 1: Use existing results endpoint (current approach)
      const response = await fetch(`/api/interview/${sessionId}/results`)
      const data = await response.json()

      setQuestions(data.questions || [])
      setResponses(data.responses || [])
      setFeedbacks(data.feedbacks || [])
      setOverallFeedback(data.overallFeedback || null)

      /* Option 2: Direct LLM API call (alternative approach)
      // First get session data without feedback
      const sessionResponse = await fetch(`/api/interview/${sessionId}`)
      const sessionData = await sessionResponse.json()
      
      if (sessionData.questions && sessionData.responses) {
        // Call LLM API directly for feedback generation
        const llmResponse = await fetch('/api/llm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            questions: sessionData.questions,
            responses: sessionData.responses
          })
        })
        
        const llmData = await llmResponse.json()
        
        setQuestions(llmData.questions || [])
        setResponses(llmData.responses || [])
        setFeedbacks(llmData.feedbacks || [])
        setOverallFeedback(llmData.overallFeedback || null)
      }
      */
    } catch (error) {
      console.error("[v0] Error loading results:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Analyzing your interview performance...</p>
        </div>
      </div>
    )
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500"
    if (score >= 60) return "text-yellow-500"
    return "text-red-500"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent"
    if (score >= 60) return "Good"
    return "Needs Improvement"
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3">Interview Results</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Here's your detailed performance analysis and personalized feedback
          </p>
        </div>

        {/* Overall Score Card */}
        {overallFeedback && (
          <Card className="p-8 mb-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Overall Performance</h2>
                <p className="text-muted-foreground">
                  {responses.length} of {questions.length} questions answered
                </p>
              </div>
              <div className="text-center">
                <div className={`text-5xl font-bold ${getScoreColor(overallFeedback.overallScore)}`}>
                  {overallFeedback.overallScore}
                </div>
                <div className="text-sm text-muted-foreground mt-1">{getScoreLabel(overallFeedback.overallScore)}</div>
              </div>
            </div>
            <Progress value={overallFeedback.overallScore} className="h-3 mb-6" />
            <p className="text-sm leading-relaxed">{overallFeedback.summary}</p>
          </Card>
        )}

        {/* Key Insights */}
        {overallFeedback && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="p-6 bg-card border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
                <h3 className="text-lg font-semibold">Key Strengths</h3>
              </div>
              <ul className="space-y-3">
                {overallFeedback.keyStrengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="leading-relaxed">{strength}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-6 bg-card border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-yellow-500/10 rounded-lg">
                  <TrendingDown className="h-5 w-5 text-yellow-500" />
                </div>
                <h3 className="text-lg font-semibold">Areas for Improvement</h3>
              </div>
              <ul className="space-y-3">
                {overallFeedback.areasForImprovement.map((area, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span className="leading-relaxed">{area}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        )}

        {/* Individual Question Feedback */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Question-by-Question Analysis</h2>
          <div className="space-y-6">
            {feedbacks.map((feedback, index) => {
              const question = questions.find((q) => q.id === feedback.questionId)
              const response = responses.find((r) => r.questionId === feedback.questionId)

              return (
                <Card key={feedback.questionId} className="p-6 bg-card border-border">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-muted-foreground">Question {index + 1}</span>
                        {question?.category && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">
                            {question.category}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold leading-relaxed text-balance">{question?.question}</h3>
                    </div>
                    <div className="text-center ml-4">
                      <div className={`text-3xl font-bold ${getScoreColor(feedback.score)}`}>{feedback.score}</div>
                      <div className="text-xs text-muted-foreground">/ 100</div>
                    </div>
                  </div>

                  {response?.code && (
                    <div className="mb-4 p-4 bg-muted/50 rounded-lg border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <Code className="h-4 w-4 text-primary" />
                        <p className="text-sm font-medium">Your Code Solution:</p>
                      </div>
                      <pre className="text-xs font-mono bg-background p-3 rounded border border-border overflow-x-auto">
                        {response.code}
                      </pre>
                    </div>
                  )}

                  <div className="mb-4 p-4 bg-muted/50 rounded-lg border border-border">
                    <p className="text-sm font-medium mb-2">Your Response:</p>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {response?.transcript}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        Strengths
                      </h4>
                      <ul className="space-y-1">
                        {feedback.strengths.map((strength, i) => (
                          <li key={i} className="text-sm text-muted-foreground pl-6">
                            • {strength}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                        Areas to Improve
                      </h4>
                      <ul className="space-y-1">
                        {feedback.improvements.map((improvement, i) => (
                          <li key={i} className="text-sm text-muted-foreground pl-6">
                            • {improvement}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold mb-2">Detailed Analysis</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{feedback.detailedAnalysis}</p>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-4">
          <Link href="/">
            <Button variant="outline">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        </div>
      </div>
    </div>
  )
}
