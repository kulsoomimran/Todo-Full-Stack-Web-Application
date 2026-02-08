import { NextRequest, NextResponse } from 'next/server';

/**
 * BFF Proxy Route for Signup
 * This acts as a Backend for Frontend to forward requests to the FastAPI backend
 */
export async function POST(request: NextRequest) {
  try {
    // Get the request body
    const body = await request.json();

    // Forward the request to the backend API
    const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:8000';
    const response = await fetch(`${backendUrl}/api/v1/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const text = await response.text();
    try {
      const parsed = JSON.parse(text);
      return NextResponse.json(parsed, { status: response.status });
    } catch (e) {
      console.warn('Backend returned non-JSON response for signup:', text);
      return NextResponse.json(
        { error: response.ok ? undefined : 'Backend error', body: text },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('Error in POST /api/auth/signup:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}