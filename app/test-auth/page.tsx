'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestAuthPage() {
  const [result, setResult] = useState<string>('');

  const testAuthEndpoint = async () => {
    try {
      const response = await fetch('/auth/login');
      if (response.ok) {
        setResult('✅ Auth endpoint is working - redirecting to Auth0...');
        // Follow the redirect
        window.location.href = '/auth/login';
      } else {
        const error = await response.text();
        setResult(`❌ Error: ${response.status} - ${error}`);
      }
    } catch (error) {
      setResult(`❌ Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Auth0 Configuration Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={testAuthEndpoint} className="w-full">
            Test Auth0 Login Endpoint
          </Button>
          
          {result && (
            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm">{result}</p>
            </div>
          )}
          
          <div className="text-sm text-muted-foreground">
            <p><strong>Expected URLs in Auth0 Dashboard:</strong></p>
            <ul className="mt-2 space-y-1">
              <li>• Callback: <code>http://localhost:3000/auth/callback</code></li>
              <li>• Logout: <code>http://localhost:3000</code></li>
              <li>• Web Origins: <code>http://localhost:3000</code></li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
