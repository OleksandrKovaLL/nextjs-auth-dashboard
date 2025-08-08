import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { generateToken } from '@/lib/jwt';
import { comparePassword, isValidEmail } from '@/lib/auth';
import User from "@/models/User";

export async function POST(request: NextRequest) {
    try {
        // Parse request body
        const body = await request.json();
        const { email, password } = body;

        // Basic validation
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        if (!isValidEmail(email)) {
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400 }
            );
        }

        // Connect to database
        await dbConnect();

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
        if (!user) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Verify password
        const isValidPassword = await comparePassword(password, user.password);
        if (!isValidPassword) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Generate JWT token
        const tokenPayload = {
            userId: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
        };

        const token = await generateToken(tokenPayload);

        // Create response
        const response = NextResponse.json(
            {
                success: true,
                message: 'Login successful',
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                }
            },
            { status: 200 }
        );

        // Set HTTP-only cookie
        response.cookies.set('auth-token', token, {
            httpOnly: true,
            secure: false
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
            path: '/',
        });

        return response;

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error. Please try again later.' },
            { status: 500 }
        );
    }
}