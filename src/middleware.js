import { NextResponse } from 'next/server';

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // Retrieve cookies
  const cookieStore = req.cookies;
  // const isAuthenticated = cookieStore.get('auth')?.value === 'true';
  const isAuthenticated = cookieStore.get('auth')?.value === 'true' || false;

  // Debug logs to confirm middleware execution
  console.log('Middleware executing');
  console.log('Request Path:', pathname);
  console.log('Is Authenticated:', isAuthenticated);
  console.log('All Cookies:', cookieStore.getAll());

  // If not authenticated and trying to access a whiteboard page, redirect to the login page
  if (!isAuthenticated && pathname.startsWith('/whiteboard/')) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname); // Pass the original path as a query parameter
    console.log('Redirecting to:', url.href);

    console.log('Middleware executing');
    console.log('Request Path:', pathname);
    console.log('Is Authenticated:', isAuthenticated);
    console.log('All Cookies:', cookieStore.getAll());
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/whiteboard/:path*'],
};
