import { NextRequest } from 'next/server';
import { auth0 } from '../../../../lib/auth0';

// Proxy the Auth0 middleware so /api/auth/* behaves like /auth/*
export async function GET(request: NextRequest) {
	try {
		return await auth0.middleware(request);
	} catch (error) {
		console.error('Auth0 middleware error (api route):', error);
		return new Response(
			JSON.stringify({ error: 'Authentication failed', details: error instanceof Error ? error.message : 'Unknown error' }),
			{ status: 500, headers: { 'Content-Type': 'application/json' } }
		);
	}
}

export async function POST(request: NextRequest) {
	// Some auth callbacks or logout flows may use POST; forward them as well.
	try {
		return await auth0.middleware(request);
	} catch (error) {
		console.error('Auth0 middleware error (api route POST):', error);
		return new Response(JSON.stringify({ error: 'Authentication failed' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
	}
}
