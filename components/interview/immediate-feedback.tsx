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
      <Card className="p-6 mb-6 bg-gradient-to-br from-gray-900 to-black border border-red-600/30 shadow-lg shadow-red-500/10">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Analyzing your response...</p>
        </div>
      </Card>
    )
  }

  if (!feedback) {
    return null
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400"
    if (score >= 60) return "text-yellow-400"
    return "text-red-400"
  }

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-5 w-5 text-green-400" />
    if (score >= 60) return <AlertCircle className="h-5 w-5 text-yellow-400" />
    return <AlertCircle className="h-5 w-5 text-red-400" />
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <TrendingUp className="h-4 w-4 text-green-400" />
      case "negative":
        return <TrendingDown className="h-4 w-4 text-red-400" />
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-400" />
    }
  }

  return (
    <Card className="p-6 mb-6 bg-gradient-to-br from-gray-900 to-black border border-red-600/30 shadow-lg shadow-red-500/10">
      <div className="space-y-6">
        {/* Score Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Immediate Feedback</h3>
          <div className="flex items-center gap-2">
            {getScoreIcon(feedback.score)}
            <span className={`text-2xl font-bold ${getScoreColor(feedback.score)}`}>
              {feedback.score}/100
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={feedback.score} className="h-3 bg-gray-800" />
          <div className="flex justify-between text-sm text-gray-400">
            <span>Needs Improvement</span>
            <span>Excellent</span>
          </div>
        </div>

        {/* Sentiment */}
        <div className="flex items-center gap-2">
          {getSentimentIcon(feedback.sentiment)}
          <Badge 
            variant={feedback.sentiment === "positive" ? "default" : feedback.sentiment === "negative" ? "destructive" : "secondary"}
            className="bg-red-600/20 border border-red-600/30 text-white"
          >
            {feedback.sentiment.charAt(0).toUpperCase() + feedback.sentiment.slice(1)} Response
          </Badge>
        </div>

        {/* Strengths */}
        {feedback.strengths.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-green-400 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Strengths
            </h4>
            <ul className="space-y-2">
              {feedback.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-green-400 mt-1">•</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Areas for Improvement */}
        {feedback.improvements.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-yellow-400 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Areas for Improvement
            </h4>
            <ul className="space-y-2">
              {feedback.improvements.map((improvement, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-yellow-400 mt-1">•</span>
                  <span>{improvement}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Detailed Analysis */}
        {feedback.detailedAnalysis && (
          <div className="space-y-3">
            <h4 className="font-medium text-white">Detailed Analysis</h4>
            <div className="text-sm text-gray-300 leading-relaxed bg-gray-800/50 p-4 rounded-lg border border-gray-700">
              {feedback.detailedAnalysis}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
