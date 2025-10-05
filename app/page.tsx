import type React from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Brain, Mic, TrendingUp, Code, ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block p-3 bg-primary/10 rounded-2xl mb-6">
            <Brain className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">Master Your Interview Skills with AI</h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
            Practice behavioral and technical interviews with AI-powered feedback. Get personalized insights to improve
            your performance and land your dream job.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/login">
              <Button size="lg" className="h-12 px-8">
                Start Practicing
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Brain className="h-6 w-6" />}
              title="AI-Generated Questions"
              description="Get realistic interview questions powered by Gemini AI, tailored to behavioral or technical interviews"
              iconColor="bg-blue-500/10 text-blue-500"
            />
            <FeatureCard
              icon={<Mic className="h-6 w-6" />}
              title="Voice Recording"
              description="Practice speaking your answers naturally with speech-to-text transcription powered by ElevenLabs"
              iconColor="bg-green-500/10 text-green-500"
            />
            <FeatureCard
              icon={<TrendingUp className="h-6 w-6" />}
              title="Detailed Feedback"
              description="Receive comprehensive analysis with scores, strengths, and actionable improvement suggestions"
              iconColor="bg-purple-500/10 text-purple-500"
            />
          </div>
        </div>
      </section>

      {/* Interview Types */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Choose Your Interview Type</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-8 bg-card border-border hover:border-primary/50 transition-colors">
              <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Behavioral Interviews</h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Practice answering questions about your experience, skills, and problem-solving approach using the STAR
                method
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Leadership & teamwork scenarios</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Problem-solving examples</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Communication skills assessment</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8 bg-card border-border hover:border-primary/50 transition-colors">
              <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
                <Code className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Technical Interviews</h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Solve coding problems and demonstrate your technical knowledge with algorithm and system design
                questions
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Data structures & algorithms</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>System design challenges</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Code quality evaluation</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="max-w-4xl mx-auto p-12 text-center bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <h2 className="text-3xl font-bold mb-4">Ready to Ace Your Next Interview?</h2>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
            Start practicing today and get AI-powered feedback to improve your interview performance
          </p>
          <Link href="/login">
            <Button size="lg" className="h-12 px-8">
              Start Your First Interview
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </Card>
      </section>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  iconColor,
}: {
  icon: React.ReactNode
  title: string
  description: string
  iconColor: string
}) {
  return (
    <Card className="p-6 bg-card border-border">
      <div className={`p-3 rounded-lg w-fit mb-4 ${iconColor}`}>{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </Card>
  )
}
