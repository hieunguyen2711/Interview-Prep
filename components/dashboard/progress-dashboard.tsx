"use client"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, TrendingUp, Target, Award, Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"
import type { InterviewSession } from "@/types/interview"
import { StatsCard } from "./stats-card"
import { SessionHistory } from "./session-history"
import { PerformanceChart } from "./performance-chart"

export function ProgressDashboard() {
  const [sessions, setSessions] = useState<InterviewSession[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const response = await fetch("/api/dashboard")
      const data = await response.json()
      setSessions(data.sessions || [])
    } catch (error) {
      console.error("[v0] Error loading dashboard:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your progress...</p>
        </div>
      </div>
    )
  }

  const completedSessions = sessions.filter((s) => s.status === "completed")
  const totalQuestions = completedSessions.reduce((sum, s) => sum + s.questions.length, 0)
  const totalResponses = completedSessions.reduce((sum, s) => sum + (s.responses?.length || 0), 0)

  const averageScore =
    completedSessions.length > 0
      ? completedSessions.reduce((sum, s) => {
          const sessionAvg =
            s.feedbacks && s.feedbacks.length > 0
              ? s.feedbacks.reduce((fSum, f) => fSum + f.score, 0) / s.feedbacks.length
              : 0
          return sum + sessionAvg
        }, 0) / completedSessions.length
      : 0

  const recentSessions = completedSessions.slice(0, 5)

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-3">Your Progress Dashboard</h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Track your interview practice journey and improvement over time
            </p>
          </div>
          <Link href="/interview/new">
            <Button size="lg">
              <Plus className="mr-2 h-4 w-4" />
              New Interview
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon={<Target className="h-5 w-5" />}
            label="Total Sessions"
            value={completedSessions.length.toString()}
            trend={completedSessions.length > 0 ? "+12% this month" : undefined}
            iconColor="bg-blue-500/10 text-blue-500"
          />
          <StatsCard
            icon={<Award className="h-5 w-5" />}
            label="Average Score"
            value={`${Math.round(averageScore)}%`}
            trend={averageScore > 70 ? "Above target" : "Keep practicing"}
            iconColor="bg-green-500/10 text-green-500"
          />
          <StatsCard
            icon={<TrendingUp className="h-5 w-5" />}
            label="Questions Answered"
            value={totalResponses.toString()}
            trend={`${totalQuestions} total questions`}
            iconColor="bg-purple-500/10 text-purple-500"
          />
          <StatsCard
            icon={<Calendar className="h-5 w-5" />}
            label="Practice Streak"
            value="0 days"
            trend="Keep it up!"
            iconColor="bg-orange-500/10 text-orange-500"
          />
        </div>

        {/* Performance Chart */}
        {completedSessions.length > 0 && (
          <Card className="p-6 mb-8 bg-card border-border">
            <h2 className="text-xl font-semibold mb-6">Performance Trend</h2>
            <PerformanceChart sessions={completedSessions} />
          </Card>
        )}

        {/* Recent Sessions */}
        {recentSessions.length > 0 ? (
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Recent Interview Sessions</h2>
              <Link href="/history">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <SessionHistory sessions={recentSessions} />
          </Card>
        ) : (
          <Card className="p-12 text-center bg-card border-border">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Start Your First Interview</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Begin your interview preparation journey by taking your first practice session
              </p>
              <Link href="/interview/new">
                <Button size="lg">
                  <Plus className="mr-2 h-4 w-4" />
                  Start Practicing
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
