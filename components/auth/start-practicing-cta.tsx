"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { simpleAuth } from "@/lib/simple-auth"

export default function StartPracticingCta() {
  const user = simpleAuth.getCurrentUser()
  const href = user ? "/interview/new" : "/dashboard"

  return (
    <Link href={href}>
      <Button size="lg" className="h-12 px-8">
        Start Practicing
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </Link>
  )
}
