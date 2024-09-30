import { NextResponse } from 'next/server';

export function middleware(req) {
  const { pathname } = req.nextUrl;
  
  // Check for the auth cookie
  const isAuthenticated = req.cookies.get('auth') === 'true';

  // If not authenticated and trying to access a whiteboard page, redirect to the login page
  if (!isAuthenticated && pathname.startsWith('/whiteboard/')) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname); // Pass the original path as a query parameter
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Define the paths to be checked by the middleware
export const config = {
  matcher: ['/whiteboard/:path*'],
};
