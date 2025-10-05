import { NextRequest } from 'next/server';
import { auth0 } from '../../../lib/auth0';

export async function GET(request: NextRequest) {
  try {
    return await auth0.middleware(request);
  } catch (error) {
    console.error('Auth0 middleware error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Authentication failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }), 
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
}


