import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const { pathname } = request.nextUrl;

  // Protected routes
  const protectedRoutes = ['/dashboard'];
  
  // Auth routes
  const authRoutes = ['/login', '/signup'];

  // Check if the route is protected and user is not authenticated
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Check if the user is authenticated and trying to access auth routes
  if (authRoutes.some(route => pathname.startsWith(route)) && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Configure the middleware to run only on specific paths
export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup'],
}; 