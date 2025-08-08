import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { generateToken } from '@/lib/jwt';
import { hashPassword, validateRegistrationData } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, password } = body;

        const validation = validateRegistrationData({ name, email, password });
        if (!validation.isValid) {
            return NextResponse.json(
                { error: validation.errors.join(', ') },
                { status: 400 }
            );
        }

        // Connect MongoDB
        await dbConnect();
        console.log('🗃️ Connected to MongoDB for registration');

        const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
        if (existingUser) {
            return NextResponse.json(
                { error: 'Користувач з таким email вже існує' },
                { status: 409 }
            );
        }

        const hashedPassword = await hashPassword(password);

        const user = await User.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
        });

        console.log('👤 User created in MongoDB:', user.email);

        const tokenPayload = {
            userId: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
        };

        const token = await generateToken(tokenPayload);

        const response = NextResponse.json(
            {
                success: true,
                message: 'Користувач успішно зареєстрований',
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                }
            },
            { status: 201 }
        );

        response.cookies.set('auth-token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: '/',
        });

        return response;

    } catch (error) {
        console.error('Registration error:', error);

        if (error instanceof Error && error.name === 'ValidationError') {
            return NextResponse.json(
                { error: 'Невірні дані користувача' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Помилка сервера. Спробуйте пізніше.' },
            { status: 500 }
        );
    }
}