"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useUser } from '@auth0/nextjs-auth0'

export default function StartPracticingCta() {
  const { user, isLoading } = useUser()

  const href = user ? "/interview/new" : "/login"

  return (
    <Link href={href}>
      <Button size="lg" className="h-12 px-8">
        {user ? "Start Practicing" : "Start Practicing"}
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </Link>
  )
}
