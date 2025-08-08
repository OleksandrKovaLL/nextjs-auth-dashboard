import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.warn('⚠️ JWT_SECRET is not set in environment variables');
}

const secretKey = new TextEncoder().encode(JWT_SECRET);

export interface TokenPayload extends JWTPayload {
    userId: string;
    email: string;
    name: string;
    role: string;
}

//Generate JWT token
export async function generateToken(payload: TokenPayload): Promise<string> {
    return await new SignJWT(payload as JWTPayload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuer('nextjs-auth-dashboard')
        .setAudience('nextjs-users')
        .setExpirationTime('7d')
        .sign(secretKey);
}


//Verify JWT token
export async function verifyToken(token: string): Promise<TokenPayload | null> {
    try {
        const { payload } = await jwtVerify(token, secretKey, {
            issuer: 'nextjs-auth-dashboard',
            audience: 'nextjs-users'
        });

        return payload as unknown as TokenPayload;
    } catch (error) {
        console.error('JWT verification failed:', error);
        return null;
    }
}


//Get token from HTTP-only cookies (server-side only)
export async function getTokenFromCookies(): Promise<string | null> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth-token');
        return token?.value || null;
    } catch (error) {
        console.warn('Cannot access cookies:', error);
        return null;
    }
}


//Get token from cookies using Request object)
export function getTokenFromRequest(request: Request): string | null {
    try {
        const cookieHeader = request.headers.get('cookie');
        if (!cookieHeader) return null;

        const cookies = Object.fromEntries(
            cookieHeader.split('; ').map(cookie => {
                const [name, ...rest] = cookie.split('=');
                return [name.trim(), decodeURIComponent(rest.join('='))];
            })
        );

        return cookies['auth-token'] || null;
    } catch (error) {
        console.error('Error parsing cookies from request:', error);
        return null;
    }
}

/**
 * Get current authenticated user from cookies (server-side only)
 */
export async function getCurrentUser(): Promise<TokenPayload | null> {
    try {
        const token = await getTokenFromCookies();
        if (!token) return null;
        return await verifyToken(token);
    } catch (error) {
        console.warn('Cannot get current user:', error);
        return null;
    }
}


 //Get current user from Request object
export async function getCurrentUserFromRequest(request: Request): Promise<TokenPayload | null> {
    const token = getTokenFromRequest(request);

    if (!token) return null;

    return await verifyToken(token);
}

export async function isAuthenticated(): Promise<boolean> {
    try {
        const user = await getCurrentUser();
        return user !== null;
    } catch (error) {
        return false;
    }
}
