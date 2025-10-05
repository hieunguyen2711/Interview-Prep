import { InterviewSession } from "@/components/interview/interview-session"
import { SimpleProtectedRoute } from "@/components/auth/simple-protected-route"

export default async function InterviewPage({ params }: { params: { id: string } }) {
  const { id } = await params

  return (
    <SimpleProtectedRoute>
      <div className="min-h-screen bg-background">
        <InterviewSession sessionId={id} />
      </div>
    </SimpleProtectedRoute>
  )
}
