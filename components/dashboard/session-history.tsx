import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, TrendingUp, Eye } from "lucide-react"
import Link from "next/link"
import type { InterviewSession } from "@/types/interview"

interface SessionHistoryProps {
  sessions: InterviewSession[]
}

export function SessionHistory({ sessions }: SessionHistoryProps) {
  const getSessionScore = (session: InterviewSession): number => {
    if (!session.feedbacks || session.feedbacks.length === 0) return 0
    return Math.round(session.feedbacks.reduce((sum, f) => sum + f.score, 0) / session.feedbacks.length)
  }

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getScoreColor = (score: number): string => {
    if (score >= 80) return "text-green-500"
    if (score >= 60) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => {
        const score = getSessionScore(session)
        return (
          <Card key={session.id} className="p-4 bg-muted/30 border-border hover:border-primary/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                    {session.type === "behavioral" ? "Behavioral" : "Technical"}
                  </span>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(session.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground">
                    {session.responses?.length || 0} / {session.questions.length} questions answered
                  </span>
                  {score > 0 && (
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span className={`font-semibold ${getScoreColor(score)}`}>{score}% avg score</span>
                    </div>
                  )}
                </div>
              </div>
              <Link href={`/interview/${session.id}/results`}>
                <Button variant="outline" size="sm">
                  <Eye className="mr-2 h-4 w-4" />
                  View Results
                </Button>
              </Link>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
