'use client';

import { useUser } from '@auth0/nextjs-auth0';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { User, LogOut, Settings, LogIn } from 'lucide-react';

export default function UserProfile() {
  const { user, error, isLoading } = useUser();

  // Show loading state
  if (isLoading) {
    return (
      <Button variant="outline" size="sm" disabled>
        <User className="w-4 h-4 mr-2" />
        Loading...
      </Button>
    );
  }

  // Treat errors (e.g., 401 Unauthorized) as unauthenticated and show Login
  if (error) {
    return (
      <Button asChild variant="outline" size="sm">
        <Link href="/login">
          <LogIn className="mr-2 h-4 w-4" />
          Login
        </Link>
      </Button>
    );
  }

  // Show login button if not authenticated
  if (!user) {
    return (
      <Button asChild variant="outline" size="sm">
        <Link href="/login">
          <LogIn className="mr-2 h-4 w-4" />
          Login
        </Link>
      </Button>
    );
  }

  // Generate user initials
  const userInitials = user.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || 'U';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={user.picture} alt={user.name || 'User'} />
            <AvatarFallback className="text-xs">{userInitials}</AvatarFallback>
          </Avatar>
          <span className="hidden sm:inline">{user.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex items-center justify-start gap-2 p-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.picture} alt={user.name || 'User'} />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a href="/auth/logout">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
