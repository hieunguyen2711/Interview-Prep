import { ProgressDashboard } from "@/components/dashboard/progress-dashboard"
import { SimpleProtectedRoute } from "@/components/auth/simple-protected-route"

export default function DashboardPage() {
  return (
    <SimpleProtectedRoute>
      <div className="min-h-screen bg-background">
        <ProgressDashboard />
      </div>
    </SimpleProtectedRoute>
  )
}
