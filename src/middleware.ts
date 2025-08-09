import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';

export const locales = ['ua', 'en'];
export const defaultLocale = 'ua';

// Create the internationalization middleware
const intlMiddleware = createMiddleware({
    locales: locales,
    defaultLocale: defaultLocale,
    localePrefix: 'always'
});

export default async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (pathname === '/') {
        const res = NextResponse.redirect(new URL('/ua', request.url));
        res.cookies.set('NEXT_LOCALE', 'ua');
        return res;
    }

    // First, handle internationalization
    const response = intlMiddleware(request);

    // Extract locale from pathname
    const pathnameSegments = pathname.split('/');
    const locale = pathnameSegments[1];

    // Only proceed if we have a valid locale
    if (!locales.includes(locale as any)) {
        return response;
    }

    // Persist current locale for server-side consumption
    try {
        response.cookies.set('NEXT_LOCALE', locale);
    } catch (e) {
        console.log('🔒 Middleware: Failed to set NEXT_LOCALE cookie');
    }

    // Define protected routes that require authentication
    const protectedRoutes = ['/dashboard'];
    const isProtectedRoute = protectedRoutes.some(route =>
        pathname.includes(`/${locale}${route}`)
    );

    // Check authentication for protected routes
    if (isProtectedRoute) {
        const token = request.cookies.get('auth-token')?.value;

        if (!token) {
            const loginUrl = new URL(`/${locale}/login`, request.url);
            loginUrl.searchParams.set('redirect', pathname);
            const res = NextResponse.redirect(loginUrl);
            res.cookies.set('NEXT_LOCALE', locale);
            return res;
        }

        // Verify token
        const user = await verifyToken(token);

        if (!user) {
            const loginUrl = new URL(`/${locale}/login`, request.url);
            loginUrl.searchParams.set('redirect', pathname);
            const res = NextResponse.redirect(loginUrl);
            res.cookies.set('NEXT_LOCALE', locale);
            return res;
        }
    }

    // Define auth routes (login, register)
    const authRoutes = ['/login', '/register'];
    const isAuthRoute = authRoutes.some(route =>
        pathname.includes(`/${locale}${route}`)
    );

    // Redirect authenticated users away from auth pages
    if (isAuthRoute) {
        const token = request.cookies.get('auth-token')?.value;

        if (token) {
            const decoded = await verifyToken(token);
            if (decoded) {
            const dashboardUrl = new URL(`/${locale}/dashboard`, request.url);
            const res = NextResponse.redirect(dashboardUrl);
            res.cookies.set('NEXT_LOCALE', locale);
            return res;
            }
        }
    }

    return response;
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)']
};