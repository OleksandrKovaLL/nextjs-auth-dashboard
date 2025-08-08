'use client';

import { useState, useEffect } from 'react';
import { TokenPayload } from '@/lib/jwt';

interface AuthState {
    user: TokenPayload | null;
    isLoading: boolean;
    isAuthenticated: boolean;
}

export function useAuth() {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        isLoading: true,
        isAuthenticated: false,
    });

    // Check authentication status
    const checkAuth = async () => {
        try {
            const response = await fetch('/api/auth/me', {
                method: 'GET',
                credentials: 'include', // Include cookies
            });

            if (response.ok) {
                const userData = await response.json();
                setAuthState({
                    user: userData.user,
                    isLoading: false,
                    isAuthenticated: true,
                });
            } else {
                setAuthState({
                    user: null,
                    isLoading: false,
                    isAuthenticated: false,
                });
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            setAuthState({
                user: null,
                isLoading: false,
                isAuthenticated: false,
            });
        }
    };

    // Login function
    const login = async (email: string, password: string) => {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setAuthState({
                    user: data.user,
                    isLoading: false,
                    isAuthenticated: true,
                });
                return { success: true, message: data.message };
            } else {
                return { success: false, error: data.error };
            }
        } catch (error) {
            console.error('Login failed:', error);
            return { success: false, error: 'Network error occurred' };
        }
    };

    // Register function
    const register = async (name: string, email: string, password: string) => {
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setAuthState({
                    user: data.user,
                    isLoading: false,
                    isAuthenticated: true,
                });
                return { success: true, message: data.message };
            } else {
                return { success: false, error: data.error };
            }
        } catch (error) {
            console.error('Registration failed:', error);
            return { success: false, error: 'Network error occurred' };
        }
    };

    // Logout function
    const logout = async () => {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });

            setAuthState({
                user: null,
                isLoading: false,
                isAuthenticated: false,
            });
        } catch (error) {
            console.error('Logout failed:', error);
            // Still clear local state even if request fails
            setAuthState({
                user: null,
                isLoading: false,
                isAuthenticated: false,
            });
        }
    };

    // Check auth status on mount
    useEffect(() => {
        checkAuth();
    }, []);

    return {
        ...authState,
        login,
        register,
        logout,
        checkAuth,
    };
}