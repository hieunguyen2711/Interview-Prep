'use client';

import { useUser } from '@auth0/nextjs-auth0';
import { Button } from '@/components/ui/button';
import { LogIn, User } from 'lucide-react';

export default function LoginButton() {
  const { user, error, isLoading } = useUser();

  if (isLoading) {
    return (
      <Button variant="outline" disabled>
        <User className="w-4 h-4 mr-2" />
        Loading...
      </Button>
    );
  }

  if (error) {
    return (
      <Button variant="outline" disabled>
        <User className="w-4 h-4 mr-2" />
        Error loading user
      </Button>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          Welcome, {user.name}
        </span>
        <Button asChild variant="outline">
          <a href="/api/auth/logout">
            Logout
          </a>
        </Button>
      </div>
    );
  }

  return (
    <Button asChild>
      <a href="/api/auth/login">
        <LogIn className="w-4 h-4 mr-2" />
        Login
      </a>
    </Button>
  );
}
