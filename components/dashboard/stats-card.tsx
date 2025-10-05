import { Card } from "@/components/ui/card"
import type { ReactNode } from "react"

interface StatsCardProps {
  icon: ReactNode
  label: string
  value: string
  trend?: string
  iconColor?: string
}

export function StatsCard({ icon, label, value, trend, iconColor = "bg-primary/10 text-primary" }: StatsCardProps) {
  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2 rounded-lg ${iconColor}`}>{icon}</div>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-1">{label}</p>
        <p className="text-3xl font-bold mb-1">{value}</p>
        {trend && <p className="text-xs text-muted-foreground">{trend}</p>}
      </div>
    </Card>
  )
}
