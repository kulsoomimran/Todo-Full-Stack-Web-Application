import { NextRequest, NextResponse } from 'next/server';

/**
 * BFF Proxy Route for Individual Todos
 * This acts as a Backend for Frontend to forward requests to the FastAPI backend
 * with the JWT token attached as an Authorization header
 */

// Dynamic segments for route parameters
export const dynamic = 'force-dynamic';

// GET /api/todos/[id] - Get a specific todo
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Extract todo ID from the URL
    const { id } = await params;

    // Extract the JWT token from the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!id) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Todo ID is required' },
        { status: 400 }
      );
    }

    // Forward the request to the backend API
    const backendUrl = (process.env.BACKEND_API_URL || 'https://kulsoomimran-todos-app.hf.space/').replace(/\/+$/, '');
    console.log('BFF todos/[id] GET: resolved BACKEND_API_URL=', backendUrl, 'id=', id);
    const response = await fetch(`${backendUrl}/api/v1/todos/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    const text = await response.text();
    console.log('BFF todos/[id] GET: upstream response status=', response.status, 'content-type=', response.headers.get('content-type'));
    console.log('BFF todos/[id] GET: upstream body (first 1000 chars)=', text.slice(0, 1000));
    try {
      const parsed = JSON.parse(text);
      return NextResponse.json(parsed, { status: response.status });
    } catch (e) {
      console.warn('Backend returned non-JSON response for GET /api/todos/[id]:', text);
      return NextResponse.json(
        { error: response.ok ? undefined : 'Backend error', body: text },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('Error in GET /api/todos/[id]:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// PUT /api/todos/[id] - Update a specific todo
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Extract todo ID from the URL
    const { id } = await params;

    // Extract the JWT token from the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!id) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Todo ID is required' },
        { status: 400 }
      );
    }

    // Get the request body
    const body = await request.json();

    // Forward the request to the backend API
    const backendUrl = (process.env.BACKEND_API_URL || 'https://kulsoomimran-todos-app.hf.space/').replace(/\/+$/, '');
    console.log('BFF todos/[id] PUT: resolved BACKEND_API_URL=', backendUrl, 'id=', id);
    const response = await fetch(`${backendUrl}/api/v1/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    const text = await response.text();
    console.log('BFF todos/[id] PUT: upstream response status=', response.status, 'content-type=', response.headers.get('content-type'));
    console.log('BFF todos/[id] PUT: upstream body (first 1000 chars)=', text.slice(0, 1000));
    try {
      const parsed = JSON.parse(text);
      return NextResponse.json(parsed, { status: response.status });
    } catch (e) {
      console.warn('Backend returned non-JSON response for PUT /api/todos/[id]:', text);
      return NextResponse.json(
        { error: response.ok ? undefined : 'Backend error', body: text },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('Error in PUT /api/todos/[id]:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// DELETE /api/todos/[id] - Delete a specific todo
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Extract todo ID from the URL
    const { id } = await params;

    // Extract the JWT token from the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!id) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Todo ID is required' },
        { status: 400 }
      );
    }

    // Forward the request to the backend API
    const backendUrl = (process.env.BACKEND_API_URL || 'https://kulsoomimran-todos-app.hf.space/').replace(/\/+$/, '');
    console.log('BFF todos/[id] DELETE: resolved BACKEND_API_URL=', backendUrl, 'id=', id);
    const response = await fetch(`${backendUrl}/api/v1/todos/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    // For DELETE, the backend returns 204 No Content, so we don't try to parse JSON
    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const text = await response.text();
    console.log('BFF todos/[id] DELETE: upstream response status=', response.status, 'content-type=', response.headers.get('content-type'));
    console.log('BFF todos/[id] DELETE: upstream body (first 1000 chars)=', text.slice(0, 1000));
    try {
      const parsed = JSON.parse(text);
      return NextResponse.json(parsed, { status: response.status });
    } catch (e) {
      console.warn('Backend returned non-JSON response for DELETE /api/todos/[id]:', text);
      return NextResponse.json(
        { error: response.ok ? undefined : 'Backend error', body: text },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('Error in DELETE /api/todos/[id]:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
