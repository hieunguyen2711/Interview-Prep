import { InterviewResults } from "@/components/interview/interview-results"

export default function ResultsPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-background">
      <InterviewResults sessionId={params.id} />
    </div>
  )
}
