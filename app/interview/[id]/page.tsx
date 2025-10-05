import { InterviewSession } from "@/components/interview/interview-session"

export default function InterviewPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-background">
      <InterviewSession sessionId={params.id} />
    </div>
  )
}
