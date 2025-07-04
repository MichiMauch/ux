
import { NextRequest } from 'next/server';
import { adminAuth } from './middleware/adminAuth';

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/admin')) {
    return adminAuth(req);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - admin/login (the login page itself)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|admin/login).*)',
  ],
};
