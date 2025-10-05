import { InterviewSession } from "@/components/interview/interview-session"

export default async function InterviewPage({ params }: { params: { id: string } }) {
  const { id } = await params

  return (
    <div className="min-h-screen bg-background">
      <InterviewSession sessionId={id} />
    </div>
  )
}
