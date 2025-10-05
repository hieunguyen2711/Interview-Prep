"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { SkipForward, CheckCircle } from "lucide-react"
import type { InterviewQuestion, InterviewResponse, FeedbackResult } from "@/types/interview"
import { QuestionDisplay } from "./question-display"
import { ResponseTranscript } from "./response-transcript"
import { EnhancedResponseTranscript } from "./enhanced-response-transcript"
import { SimpleTranscript } from "./simple-transcript"
import { SetupGuide } from "./setup-guide"
import { CodeEditor } from "./code-editor"
import { VoiceRecorder } from "./voice-recorder"
import { NativeVoiceRecorder } from "./native-voice-recorder"
import { ImmediateFeedback } from "./immediate-feedback"
import { DebugPanel } from "./debug-panel"

interface InterviewSessionProps {
  sessionId: string
}

export function InterviewSession({ sessionId }: InterviewSessionProps) {
  const [questions, setQuestions] = useState<InterviewQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [responses, setResponses] = useState<InterviewResponse[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [currentTranscript, setCurrentTranscript] = useState("")
  const [currentCode, setCurrentCode] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [interviewType, setInterviewType] = useState<"behavioral" | "technical">("behavioral")
  const [immediateFeedback, setImmediateFeedback] = useState<FeedbackResult | null>(null)
  const [isGrading, setIsGrading] = useState(false)
  const [resetTranscript, setResetTranscript] = useState(false)

  useEffect(() => {
    loadInterviewSession()
  }, [sessionId])

  const loadInterviewSession = async () => {
    try {
      console.log(`[v0] Loading interview session: ${sessionId}`)
      const response = await fetch(`/api/interview/${sessionId}`)
      
      if (!response.ok) {
        throw new Error(`Failed to load session: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      console.log(`[v0] Session loaded:`, { 
        sessionId: data.sessionId, 
        type: data.type, 
        questionsCount: data.questions?.length || 0 
      })
      
      setQuestions(data.questions || [])
      setResponses(data.responses || [])
      setInterviewType(data.type || "behavioral")
    } catch (error) {
      console.error("[v0] Error loading interview session:", error)
      // Set some default data to prevent complete failure
      setQuestions([])
      setResponses([])
      setInterviewType("behavioral")
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

  const handleStartRecording = () => {
    setIsRecording(true)
    setCurrentTranscript("")
    setResetTranscript(true) // Trigger transcript reset
    setTimeout(() => setResetTranscript(false), 100) // Reset the flag quickly
  }

  const handleStopRecording = async (transcript: string) => {
    setIsRecording(false)
    setCurrentTranscript(transcript)

    // Save response
    const newResponse: InterviewResponse = {
      questionId: questions[currentQuestionIndex].id,
      transcript,
      timestamp: new Date(),
      code: currentCode || undefined,
    }

    try {
      await fetch(`/api/interview/${sessionId}/response`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newResponse),
      })

      setResponses([...responses, newResponse])

      // For behavioral interviews, get immediate feedback
      if (interviewType === "behavioral" && transcript.trim().length > 10) {
        setIsGrading(true)
        setImmediateFeedback(null)
        
        try {
          const gradeResponse = await fetch(`/api/interview/${sessionId}/grade-response`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              questionId: questions[currentQuestionIndex].id,
              transcript,
            }),
          })

          if (gradeResponse.ok) {
            const gradeData = await gradeResponse.json()
            setImmediateFeedback(gradeData.feedback)
          }
        } catch (error) {
          console.error("[v0] Error getting immediate feedback:", error)
        } finally {
          setIsGrading(false)
        }
      }
    } catch (error) {
      console.error("[v0] Error saving response:", error)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setCurrentTranscript("")
      setCurrentCode("")
      setImmediateFeedback(null)
      setIsGrading(false)
      setResetTranscript(true) // Reset live transcript for next question
      setTimeout(() => setResetTranscript(false), 100)
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

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Questions Available</h2>
          <p className="text-muted-foreground mb-6">
            Unable to load interview questions. Please try creating a new interview session.
          </p>
          <Button onClick={() => window.location.href = '/interview/new'}>
            Create New Interview
          </Button>
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

        {/* Voice Recorder (behavioral only) */}
        {interviewType === "behavioral" && (
          <Card className="p-8 mb-6 bg-card border-border">
            <NativeVoiceRecorder
              isRecording={isRecording}
              onStartRecording={handleStartRecording}
              onStopRecording={handleStopRecording}
              resetTranscript={resetTranscript}
            />
          </Card>
        )}


        {/* Transcript Display */}
        {currentTranscript && (
          <div className="mb-6">
            <SimpleTranscript transcript={currentTranscript} />
          </div>
        )}


        {/* Immediate Feedback for Behavioral Interviews */}
        {interviewType === "behavioral" && (
          <ImmediateFeedback feedback={immediateFeedback} isLoading={isGrading} />
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
      
      {/* Debug Panel */}
      <DebugPanel />
    </div>
  )
}
