import { NextResponse } from "next/server"
import { generateInterviewQuestions } from "@/lib/question-generator"
import type { InterviewType } from "@/types/interview"

export async function POST(request: Request) {
  try {
    const { type, count = 5 } = await request.json()

    if (type !== "behavioral" && type !== "technical") {
      return NextResponse.json({ error: "Invalid interview type" }, { status: 400 })
    }

    const questions = await generateInterviewQuestions(type as InterviewType, count)

    return NextResponse.json({
      questions,
      count: questions.length,
    })
  } catch (error) {
    console.error("[v0] Error generating questions:", error)
    return NextResponse.json({ error: "Failed to generate questions" }, { status: 500 })
  }
}
