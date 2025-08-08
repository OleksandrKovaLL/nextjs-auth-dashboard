import { NextResponse } from 'next/server';
import { getCurrentUserFromRequest } from '@/lib/jwt';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const user = await getCurrentUserFromRequest(request);

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await new Promise(resolve => setTimeout(resolve, 200));

        const profileData = {
            id: user.userId,
            name: user.name,
            email: user.email,
            role: user.role || 'user',

            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: new Date().toISOString(),
            avatar: null,
            phone: null,
            bio: null,
            location: 'Україна',
            preferences: {
                language: 'ua',
                notifications: true,
                darkMode: false
            },
            stats: {
                loginCount: 15,
                lastLogin: new Date().toISOString(),
                productsViewed: 42,
                favoriteCategory: 'electronics'
            }
        };

        return NextResponse.json({
            success: true,
            profile: profileData
        });
    } catch (error) {
        console.error('Profile fetch error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}