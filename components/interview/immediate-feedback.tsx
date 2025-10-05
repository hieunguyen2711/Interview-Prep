"use client"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, AlertCircle, TrendingUp, TrendingDown } from "lucide-react"
import type { FeedbackResult } from "@/types/interview"

interface ImmediateFeedbackProps {
  feedback: FeedbackResult | null
  isLoading: boolean
}

export function ImmediateFeedback({ feedback, isLoading }: ImmediateFeedbackProps) {
  if (isLoading) {
    return (
      <Card className="p-6 mb-6 bg-card border-border">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Analyzing your response...</p>
        </div>
      </Card>
    )
  }

  if (!feedback) {
    return null
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-5 w-5 text-green-600" />
    if (score >= 60) return <AlertCircle className="h-5 w-5 text-yellow-600" />
    return <AlertCircle className="h-5 w-5 text-red-600" />
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "negative":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
    }
  }

  return (
    <Card className="p-6 mb-6 bg-card border-border">
      <div className="space-y-6">
        {/* Score Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Immediate Feedback</h3>
          <div className="flex items-center gap-2">
            {getScoreIcon(feedback.score)}
            <span className={`text-2xl font-bold ${getScoreColor(feedback.score)}`}>
              {feedback.score}/100
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={feedback.score} className="h-3" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Needs Improvement</span>
            <span>Excellent</span>
          </div>
        </div>

        {/* Sentiment */}
        <div className="flex items-center gap-2">
          {getSentimentIcon(feedback.sentiment)}
          <Badge variant={feedback.sentiment === "positive" ? "default" : feedback.sentiment === "negative" ? "destructive" : "secondary"}>
            {feedback.sentiment.charAt(0).toUpperCase() + feedback.sentiment.slice(1)} Response
          </Badge>
        </div>

        {/* Strengths */}
        {feedback.strengths.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-green-700 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Strengths
            </h4>
            <ul className="space-y-2">
              {feedback.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-green-600 mt-1">•</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Areas for Improvement */}
        {feedback.improvements.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-amber-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Areas for Improvement
            </h4>
            <ul className="space-y-2">
              {feedback.improvements.map((improvement, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-amber-600 mt-1">•</span>
                  <span>{improvement}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Detailed Analysis */}
        {feedback.detailedAnalysis && (
          <div className="space-y-3">
            <h4 className="font-medium">Detailed Analysis</h4>
            <div className="text-sm text-muted-foreground leading-relaxed bg-muted/50 p-4 rounded-lg">
              {feedback.detailedAnalysis}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
