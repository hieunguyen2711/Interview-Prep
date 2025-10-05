import { InterviewSetup } from "@/components/interview/interview-setup"
import { SimpleProtectedRoute } from "@/components/auth/simple-protected-route"

export default function NewInterviewPage() {
  return (
    <SimpleProtectedRoute>
      <div className="min-h-screen bg-background">
        <InterviewSetup />
      </div>
    </SimpleProtectedRoute>
  )
}
