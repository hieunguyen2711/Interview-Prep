'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Mail, UserPlus, LogIn } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Brain className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to InterviewPrep AI</CardTitle>
          <CardDescription>
            Choose an option below to continue with your Google account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <a
            href="/auth/login"
            className="inline-flex w-full h-12 items-center justify-center rounded-md bg-primary text-primary-foreground text-base font-medium hover:bg-primary/90"
          >
            <LogIn className="mr-3 h-5 w-5" />
            Sign in with Google
          </a>
          <a
            href="/auth/login?screen_hint=signup"
            className="inline-flex w-full h-12 items-center justify-center rounded-md border border-input bg-background text-base font-medium hover:bg-accent"
          >
            <UserPlus className="mr-3 h-5 w-5" />
            Sign up with Google
          </a>
          <div className="text-center text-sm text-muted-foreground pt-1">
            <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
