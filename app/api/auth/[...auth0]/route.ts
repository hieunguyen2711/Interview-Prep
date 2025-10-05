import { NextResponse } from 'next/server'

export async function GET(request: Request) {
	console.warn('[v0] Auth route placeholder called. Replace with auth provider integration.')
	return NextResponse.json({ error: 'Auth integration not configured' }, { status: 501 })
}
