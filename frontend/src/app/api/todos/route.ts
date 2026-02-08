import { NextRequest, NextResponse } from 'next/server';

/**
 * BFF Proxy Route for Todos
 * This acts as a Backend for Frontend to forward requests to the FastAPI backend
 * with the JWT token attached as an Authorization header
 */

// GET /api/todos - List todos
export async function GET(request: NextRequest) {
  try {
    // Extract the JWT token from the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Forward the request to the backend API
    const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:8000';
    const searchParams = request.nextUrl.searchParams;
    const completed = searchParams.get('completed');

    let apiUrl = `${backendUrl}/api/v1/todos`;
    if (completed !== null) {
      apiUrl += `?completed=${completed}`;
    }

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const text = await response.text();
    try {
      const parsed = JSON.parse(text);
      return NextResponse.json(parsed, { status: response.status });
    } catch (e) {
      console.warn('Backend returned non-JSON response for GET /api/todos:', text);
      return NextResponse.json(
        { error: response.ok ? undefined : 'Backend error', body: text },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('Error in GET /api/todos:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST /api/todos - Create a new todo
export async function POST(request: NextRequest) {
  try {
    // Extract the JWT token from the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Get the request body
    const body = await request.json();

    // Forward the request to the backend API
    const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:8000';
    const response = await fetch(`${backendUrl}/api/v1/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const text = await response.text();
    try {
      const parsed = JSON.parse(text);
      return NextResponse.json(parsed, { status: response.status });
    } catch (e) {
      console.warn('Backend returned non-JSON response for POST /api/todos:', text);
      return NextResponse.json(
        { error: response.ok ? undefined : 'Backend error', body: text },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('Error in POST /api/todos:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}