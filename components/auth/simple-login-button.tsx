"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { LogIn, LogOut, User } from "lucide-react"
import { simpleAuth, type User } from "@/lib/simple-auth"

export function SimpleLoginButton() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = simpleAuth.getCurrentUser()
    setUser(currentUser)
  }, [])

  const handleLogin = async () => {
    setIsLoading(true)
    try {
      const loggedInUser = simpleAuth.login()
      setUser(loggedInUser)
      
      // Redirect to dashboard or interview page
      window.location.href = '/dashboard'
    } catch (error) {
      console.error('Login failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    simpleAuth.logout()
    setUser(null)
    window.location.href = '/'
  }

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full border border-red-600/30 hover:border-red-500">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.picture} alt={user.name} />
              <AvatarFallback className="bg-red-600 text-white">
                {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-gray-900 border border-red-600/30" align="end" forceMount>
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              <p className="font-medium text-white">{user.name}</p>
              <p className="w-[200px] truncate text-sm text-gray-400">
                {user.email}
              </p>
            </div>
          </div>
          <DropdownMenuItem onClick={handleLogout} className="text-white hover:bg-red-600/20 hover:text-red-400">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Button 
      onClick={handleLogin} 
      disabled={isLoading} 
      className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 border-2 border-red-500/50 hover:border-red-400 transition-all duration-300 shadow-lg shadow-red-500/25 hover:shadow-red-500/40"
    >
      {isLoading ? (
        <>
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          Signing in...
        </>
      ) : (
        <>
          <LogIn className="mr-2 h-4 w-4" />
          Sign In
        </>
      )}
    </Button>
  )
}
