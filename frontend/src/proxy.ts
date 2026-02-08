import { NextRequest, NextResponse } from 'next/server';

// Middleware to protect routes
export async function middleware(request: NextRequest) {
  // Allow public routes
  if (request.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.next();
  }

  // Allow API routes to pass through (they handle their own auth)
  if (request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // For protected routes, we'll allow them to pass through
  // The actual authentication check will happen on the client side
  // and through our API routes which validate the JWT
  return NextResponse.next();
}

// Apply middleware to protected routes
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - auth (public routes)
     * - api (API routes handled separately)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!auth|api|_next/static|_next/image|favicon.ico).*)',
  ],
};