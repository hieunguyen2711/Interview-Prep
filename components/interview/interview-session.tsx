"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { SkipForward, CheckCircle } from "lucide-react"
import type { InterviewQuestion, InterviewResponse } from "@/types/interview"
import { QuestionDisplay } from "./question-display"
import { ResponseTranscript } from "./response-transcript"
import { CodeEditor } from "./code-editor"

interface InterviewSessionProps {
  sessionId: string
}

export function InterviewSession({ sessionId }: InterviewSessionProps) {
  const [questions, setQuestions] = useState<InterviewQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [responses, setResponses] = useState<InterviewResponse[]>([])
  const [currentTranscript, setCurrentTranscript] = useState("")
  const [currentCode, setCurrentCode] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [interviewType, setInterviewType] = useState<"behavioral" | "technical">("behavioral")

  useEffect(() => {
    loadInterviewSession()
  }, [sessionId])

  const loadInterviewSession = async () => {
    try {
      const response = await fetch(`/api/interview/${sessionId}`)
      const data = await response.json()
      setQuestions(data.questions || [])
      setResponses(data.responses || [])
      setInterviewType(data.type || "behavioral")
    } catch (error) {
      console.error("[v0] Error loading interview session:", error)
    } finally {
      setIsLoading(false)
    }
  }


  const handleCodeSubmit = (code: string, output: string) => {
    setCurrentCode(code)
    setCurrentTranscript(
      `Code Solution:\n\n${code}\n\nExecution Output:\n${output}\n\nExplanation: ${currentTranscript || "Provided code solution above"}`,
    )
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setCurrentTranscript("")
      setCurrentCode("")
    }
  }

  const handleFinishInterview = async () => {
    try {
      await fetch(`/api/interview/${sessionId}/complete`, {
        method: "POST",
      })
      window.location.href = `/interview/${sessionId}/results`
    } catch (error) {
      console.error("[v0] Error completing interview:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading interview session...</p>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100
  const isLastQuestion = currentQuestionIndex === questions.length - 1
  const hasResponse = currentTranscript.length > 0

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-muted-foreground">
              Question {currentQuestionIndex + 1} of {questions.length}
            </h2>
            <span className="text-sm font-medium text-muted-foreground">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="p-8 mb-6 bg-card border-border">
          <QuestionDisplay question={currentQuestion} />
        </Card>

        {/* Code Editor for Technical Questions */}
        {interviewType === "technical" && (
          <div className="mb-6">
            <CodeEditor question={currentQuestion} onCodeSubmit={handleCodeSubmit} />
          </div>
        )}


        {/* Transcript Display */}
        {currentTranscript && (
          <Card className="p-8 mb-6 bg-card border-border">
            <ResponseTranscript transcript={currentTranscript} />
          </Card>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={handleNextQuestion} disabled={!hasResponse || isLastQuestion}>
            Skip Question
            <SkipForward className="ml-2 h-4 w-4" />
          </Button>

          {isLastQuestion ? (
            <Button onClick={handleFinishInterview} disabled={!hasResponse} size="lg">
              Finish Interview
              <CheckCircle className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleNextQuestion} disabled={!hasResponse} size="lg">
              Next Question
              <SkipForward className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
