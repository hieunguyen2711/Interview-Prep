// Simple authentication system that works without external dependencies
// This provides basic authentication for development and testing

export interface User {
  id: string
  name: string
  email: string
  picture?: string
}

export class SimpleAuth {
  private static instance: SimpleAuth
  private currentUser: User | null = null

  private constructor() {
    // Check if user is stored in localStorage (client-side)
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('simple-auth-user')
      if (storedUser) {
        try {
          this.currentUser = JSON.parse(storedUser)
        } catch (error) {
          console.error('Failed to parse stored user:', error)
          localStorage.removeItem('simple-auth-user')
        }
      }
    }
  }

  static getInstance(): SimpleAuth {
    if (!SimpleAuth.instance) {
      SimpleAuth.instance = new SimpleAuth()
    }
    return SimpleAuth.instance
  }

  // Simulate login with a mock user
  login(): User {
    const mockUser: User = {
      id: '1',
      name: 'Demo User',
      email: 'demo@example.com',
      picture: 'https://via.placeholder.com/150/007bff/ffffff?text=DU'
    }

    this.currentUser = mockUser
    
    // Store in localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('simple-auth-user', JSON.stringify(mockUser))
    }

    return mockUser
  }

  // Logout user
  logout(): void {
    this.currentUser = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('simple-auth-user')
    }
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUser
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.currentUser !== null
  }

  // Get user session (for server-side compatibility)
  getSession(): { user: User } | null {
    if (this.currentUser) {
      return { user: this.currentUser }
    }
    return null
  }
}

// Export singleton instance
export const simpleAuth = SimpleAuth.getInstance()
