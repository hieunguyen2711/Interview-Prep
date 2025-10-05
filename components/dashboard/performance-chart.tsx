"use client"
import type { InterviewSession } from "@/types/interview"

interface PerformanceChartProps {
  sessions: InterviewSession[]
}

export function PerformanceChart({ sessions }: PerformanceChartProps) {
  const getSessionScore = (session: InterviewSession): number => {
    if (!session.feedbacks || session.feedbacks.length === 0) return 0
    return Math.round(session.feedbacks.reduce((sum, f) => sum + f.score, 0) / session.feedbacks.length)
  }

  const chartData = sessions
    .slice(-10)
    .reverse()
    .map((session, index) => ({
      session: index + 1,
      score: getSessionScore(session),
      date: new Date(session.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    }))

  const maxScore = 100
  const chartHeight = 200

  return (
    <div className="space-y-4">
      <div className="relative" style={{ height: chartHeight }}>
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-muted-foreground">
          <span>100</span>
          <span>75</span>
          <span>50</span>
          <span>25</span>
          <span>0</span>
        </div>

        {/* Chart area */}
        <div className="ml-8 h-full flex items-end justify-around gap-2">
          {chartData.map((data, index) => {
            const barHeight = (data.score / maxScore) * chartHeight
            const barColor = data.score >= 80 ? "bg-green-500" : data.score >= 60 ? "bg-yellow-500" : "bg-red-500"

            return (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex items-end justify-center" style={{ height: chartHeight }}>
                  <div
                    className={`w-full ${barColor} rounded-t transition-all hover:opacity-80 cursor-pointer relative group`}
                    style={{ height: barHeight }}
                  >
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-xs font-semibold">{data.score}%</span>
                    </div>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{data.date}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-muted-foreground">Excellent (80+)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-500 rounded"></div>
          <span className="text-muted-foreground">Good (60-79)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span className="text-muted-foreground">Needs Work (&lt;60)</span>
        </div>
      </div>
    </div>
  )
}
