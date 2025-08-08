import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserFromRequest } from '@/lib/jwt';

export async function GET(request: NextRequest) {
    try {
        // Get user from token in cookies
        const user = await getCurrentUserFromRequest(request);

        if (!user) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }

        // Return user data (without sensitive info)
        return NextResponse.json(
            {
                success: true,
                user: {
                    id: user.userId,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                }
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Auth check error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}