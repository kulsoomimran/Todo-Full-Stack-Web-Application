import { NextRequest, NextResponse } from 'next/server';

/**
 * BFF Proxy Route for Signin
 * This acts as a Backend for Frontend to forward requests to the FastAPI backend
 */
export async function POST(request: NextRequest) {
  try {
    // Get the request body
    const body = await request.json();

    // Forward the request to the backend API
    const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:8000';
    const response = await fetch(`${backendUrl}/api/v1/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Forward cookies from backend
      body: JSON.stringify(body),
    });

    const text = await response.text();
    try {
      const parsed = JSON.parse(text);
      // Forward any set-cookie headers from backend to client
      const nextResponse = NextResponse.json(parsed, { status: response.status });
      const setCookieHeader = response.headers.get('set-cookie');
      if (setCookieHeader) {
        nextResponse.headers.set('set-cookie', setCookieHeader);
      }
      return nextResponse;
    } catch (e) {
      // Backend returned non-JSON (HTML or plain text).
      // Check if it's a fingerprint challenge page with a redirect URL
      // Try to extract a backend redirect URL so the browser can handle fingerprint JS.
      const urlMatch = text.match(/https?:\/\/[^'"\s>]+\/api\/v1\/auth\/signin[^'"\s>]*/);
      if (urlMatch) {
        const redirectUrl = urlMatch[0];
        console.warn('Detected backend redirect URL for signin, forwarding to client:', redirectUrl);
        return NextResponse.json({ redirect: redirectUrl }, { status: 200 });
      }
      console.warn('Backend returned non-JSON response for signin:', text);
      return NextResponse.json(
        { error: response.ok ? undefined : 'Backend error', body: text },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('Error in POST /api/auth/signin:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}