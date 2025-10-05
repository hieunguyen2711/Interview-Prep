'use client';

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Brain, LayoutDashboard, Home, LogIn } from "lucide-react"
import UserProfile from "@/components/auth/user-profile"
import { useUser } from '@auth0/nextjs-auth0'

export function Header() {
  const { user } = useUser();

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <span className="font-bold text-lg">InterviewPrep AI</span>
          </Link>

          <nav className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
            </Link>
            {user && (
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
            )}
            <UserProfile />
          </nav>
        </div>
      </div>
    </header>
  )
}
