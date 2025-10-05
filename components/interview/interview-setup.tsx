"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Brain, Code, ArrowRight } from "lucide-react"
import type { InterviewType } from "@/types/interview"

export function InterviewSetup() {
  const router = useRouter()
  const [interviewType, setInterviewType] = useState<InterviewType>("behavioral")
  const [isLoading, setIsLoading] = useState(false)

  const handleStartInterview = async () => {
    setIsLoading(true)
    try {
      // Create new interview session
      const response = await fetch("/api/interview/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: interviewType }),
      })

      const data = await response.json()

      if (data.sessionId) {
        router.push(`/interview/${data.sessionId}`)
      }
    } catch (error) {
      console.error("[v0] Error creating interview session:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3">Start Your Interview Practice</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Choose your interview type and get ready to practice with AI-powered feedback
          </p>
        </div>

        <Card className="p-8 bg-card border-border">
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold mb-4 block">Select Interview Type</Label>
              <RadioGroup value={interviewType} onValueChange={(value) => setInterviewType(value as InterviewType)}>
                <div className="space-y-3">
                  <InterviewTypeOption
                    value="behavioral"
                    icon={<Brain className="h-6 w-6" />}
                    title="Behavioral Interview"
                    description="Practice answering questions about your experience, skills, and problem-solving approach"
                  />
                  <InterviewTypeOption
                    value="technical"
                    icon={<Code className="h-6 w-6" />}
                    title="Technical Interview"
                    description="Solve coding problems and demonstrate your technical knowledge with live coding"
                  />
                </div>
              </RadioGroup>
            </div>

            <div className="pt-4">
              <Button onClick={handleStartInterview} disabled={isLoading} size="lg" className="w-full">
                {isLoading ? "Creating Session..." : "Start Interview"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        <div className="mt-8 p-6 bg-muted/50 rounded-lg border border-border">
          <h3 className="font-semibold mb-3">Before You Start:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Make sure your microphone is connected and working</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Find a quiet space to practice without interruptions</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Speak clearly and naturally as you would in a real interview</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Take your time to think before answering each question</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

function InterviewTypeOption({
  value,
  icon,
  title,
  description,
}: {
  value: string
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex items-start gap-3 p-4 border border-border rounded-lg hover:border-primary/50 transition-colors cursor-pointer">
      <RadioGroupItem value={value} id={value} className="mt-1" />
      <Label htmlFor={value} className="flex-1 cursor-pointer">
        <div className="flex items-center gap-3 mb-2">
          <div className="text-primary">{icon}</div>
          <span className="font-semibold">{title}</span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </Label>
    </div>
  )
}
