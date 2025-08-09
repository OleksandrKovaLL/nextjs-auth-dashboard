import { NextResponse } from 'next/server';

export async function POST() {
    try {
        // Create response
        const response = NextResponse.json(
            {
                success: true,
                message: 'Logout successful'
            },
            { status: 200 }
        );

        // Clear the auth token cookie
        response.cookies.set('auth-token', '', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 0, // Immediately expire the cookie
            path: '/',
        });

        return response;

    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// Allow only POST method
export async function GET() {
    return NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405 }
    );
}