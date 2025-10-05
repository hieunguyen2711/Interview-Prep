"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { LogIn, User } from "lucide-react"
import { simpleAuth, type User } from "@/lib/simple-auth"

interface SimpleProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function SimpleProtectedRoute({ children, fallback }: SimpleProtectedRouteProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const currentUser = simpleAuth.getCurrentUser()
    setUser(currentUser)
    setIsLoading(false)
  }, [])

  const handleLogin = () => {
    const loggedInUser = simpleAuth.login()
    setUser(loggedInUser)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="p-8 max-w-md w-full mx-4">
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <User className="h-12 w-12 mx-auto text-muted-foreground" />
              <h1 className="text-2xl font-bold">Sign In Required</h1>
              <p className="text-muted-foreground">
                Please sign in to access the interview platform
              </p>
            </div>
            
            <Button onClick={handleLogin} size="lg" className="w-full">
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
            
            <p className="text-xs text-muted-foreground">
              This is a demo authentication system. Click "Sign In" to continue.
            </p>
          </div>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
