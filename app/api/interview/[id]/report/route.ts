import { NextResponse } from "next/server"
import { Document, Packer, Paragraph, HeadingLevel } from "docx"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  try {
    // Fetch actual interview results from the same host (relative) to avoid cross-host issues
    const res = await fetch(`${request.url.replace(/\/api\/interview\/.*$/, '')}/api/interview/${id}/results`, {
      cache: "no-store",
      // forward cookies in case results endpoint requires auth/session
      headers: { cookie: request.headers.get('cookie') || '' },
    })
    if (!res.ok) {
      const txt = await res.text().catch(() => '')
      throw new Error(`Failed to fetch interview results: ${res.status} ${res.statusText} - ${txt}`)
    }

    const data = await res.json()

    const overallFeedback = data.overallFeedback || {
      overallScore: 0,
      summary: "No feedback available",
      keyStrengths: [],
      areasForImprovement: [],
    }

    const questions = data.questions || []
    const responses = data.responses || []
    const feedbacks = data.feedbacks || []

    // Build the Word document
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({ text: "Interview Report", heading: HeadingLevel.TITLE }),
            new Paragraph({ text: `Session ID: ${id}`, spacing: { after: 200 } }),
            new Paragraph({ text: `Overall Score: ${overallFeedback.overallScore}`, spacing: { after: 200 } }),

            new Paragraph({ text: "Summary:", heading: HeadingLevel.HEADING_2 }),
            new Paragraph(overallFeedback.summary),

            new Paragraph({ text: "Key Strengths:", heading: HeadingLevel.HEADING_2 }),
            ...(overallFeedback.keyStrengths || []).map((s: string) => new Paragraph("• " + s)),

            new Paragraph({ text: "Areas for Improvement:", heading: HeadingLevel.HEADING_2 }),
            ...(overallFeedback.areasForImprovement || []).map((i: string) => new Paragraph("• " + i)),

            new Paragraph({ text: "Detailed Q&A:", heading: HeadingLevel.HEADING_1 }),
            ...questions.map((q: any, index: number) => {
              const response = responses.find((r: any) => r.questionId === q.id)
              const fb = feedbacks.find((f: any) => f.questionId === q.id)

              return [
                new Paragraph({ text: `Q${index + 1}: ${q.question}`, heading: HeadingLevel.HEADING_2 }),
                new Paragraph({ text: `Your Answer: ${response?.transcript || "N/A"}` }),
                ...(response?.code
                  ? [new Paragraph({ text: "Your Code:", heading: HeadingLevel.HEADING_3 }), new Paragraph(response.code)]
                  : []),
                new Paragraph({ text: `Score: ${fb?.score || "N/A"}/100` }),
                new Paragraph({ text: "Strengths:", heading: HeadingLevel.HEADING_3 }),
                ...(fb?.strengths || []).map((s: string) => new Paragraph("• " + s)),
                new Paragraph({ text: "Improvements:", heading: HeadingLevel.HEADING_3 }),
                ...(fb?.improvements || []).map((i: string) => new Paragraph("• " + i)),
                new Paragraph({ text: "Detailed Analysis:", heading: HeadingLevel.HEADING_3 }),
                new Paragraph(fb?.detailedAnalysis || "N/A"),
              ]
            }).flat(),
          ],
        },
      ],
    })

    
    let buffer
    try {
      buffer = await Packer.toBuffer(doc)
    } catch (err) {
      console.error('[v0] Error packing docx:', err)
      throw err
    }

    const uint8Array = new Uint8Array(buffer)

    return new NextResponse(uint8Array, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename=interview-report-${id}.docx`,
      },
    })
  } catch (error) {
    console.error("[v0] Error generating report:", error)
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 })
  }
}
