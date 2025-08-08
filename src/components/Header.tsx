'use client';

import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import LanguageSwitcher from '@/components/LanguageSwitcher';

interface HeaderProps {
    currentLocale: string;
}

export default function Header({ currentLocale }: HeaderProps) {
    const t = useTranslations(); // ✅ Правильно для Client Component
    const router = useRouter();
    const pathname = usePathname();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check authentication status on mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('/api/auth/me', {
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user);
                }
            } catch (error) {
                console.error('Auth check failed:', error);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                setUser(null);
                router.push(`/${currentLocale}`);
                router.refresh();
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    const isAuthenticated = !!user && !isLoading;

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center space-x-4">
                        <Link
                            href={`/${currentLocale}`}
                            className="flex items-center space-x-2"
                        >
                            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">T</span>
                            </div>
                            <span className="text-xl font-bold text-gray-900 hidden sm:block">
                TestApp
              </span>
                        </Link>
                    </div>

                    {/* Navigation and Actions */}
                    <div className="flex items-center space-x-4">
                        {/* Language Switcher */}
                        <LanguageSwitcher currentLocale={currentLocale} variant="pill" />

                        {/* Auth Section */}
                        {isAuthenticated ? (
                            <div className="flex items-center space-x-3">
                                <Link href={`/${currentLocale}/dashboard`}>
                                    <Button variant="ghost" className="hidden sm:inline-flex">
                                        {t('navigation.dashboard')}
                                    </Button>
                                </Link>

                                <div className="flex items-center space-x-2">
                                    <Badge variant="secondary" className="hidden sm:inline-flex">
                                        {user?.name}
                                    </Badge>
                                    <Button
                                        onClick={handleLogout}
                                        disabled={isLoggingOut}
                                        variant="outline"
                                        size="sm"
                                    >
                                        {isLoggingOut ? (
                                            <>
                                                <div className="spinner mr-2" />
                                                {t('common.loading')}
                                            </>
                                        ) : (
                                            t('common.logout')
                                        )}
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link href={`/${currentLocale}/login`}>
                                    <Button variant="ghost">
                                        {t('common.login')}
                                    </Button>
                                </Link>
                                <Link href={`/${currentLocale}/register`}>
                                    <Button>
                                        {t('common.register')}
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}