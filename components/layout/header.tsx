'use client';

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Brain, LayoutDashboard, Home, LogIn } from "lucide-react"
import { SimpleLoginButton } from "@/components/auth/simple-login-button"
import { simpleAuth, type User } from "@/lib/simple-auth"

export function Header() {
  const [user, setUser] = useState<User | null>(simpleAuth.getCurrentUser());

  useEffect(() => {
    // Listen for auth state changes
    const checkAuth = () => {
      setUser(simpleAuth.getCurrentUser())
    }
    
    // Check auth state periodically
    const interval = setInterval(checkAuth, 1000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="border-b border-red-600/30 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60 sticky top-0 z-50 shadow-lg shadow-red-500/10 relative overflow-hidden">
      {/* Subtle Spider Web Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-red-500/5 to-transparent"></div>
        <div className="absolute top-2 right-2 w-8 h-8 border border-red-500/10 rounded-full"></div>
        <div className="absolute bottom-2 left-2 w-6 h-6 border border-red-500/10 rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-4 h-4 border border-red-500/10 rounded-full"></div>
      </div>
      
      <div className="container mx-auto px-4 relative">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-2 bg-red-600/20 rounded-lg border border-red-600/30 group-hover:bg-red-600/30 transition-all duration-300">
              <Brain className="h-6 w-6 text-red-500" />
            </div>
            <span className="font-bold text-xl text-white group-hover:text-red-400 transition-colors duration-300">
              Mock Mate
            </span>
          </Link>

          <nav className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-white hover:text-red-400 hover:bg-red-600/10 border border-transparent hover:border-red-600/30 transition-all duration-300">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
            </Link>
            {user && (
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="text-white hover:text-red-400 hover:bg-red-600/10 border border-transparent hover:border-red-600/30 transition-all duration-300">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
            )}
            <SimpleLoginButton />
          </nav>
        </div>
      </div>
    </header>
  )
}
