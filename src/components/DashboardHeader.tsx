'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useTranslations } from 'next-intl';

interface DashboardHeaderProps {
    locale: string;
    title: string;
    subtitle?: string;
}

export default function DashboardHeader({ locale, title, subtitle }: DashboardHeaderProps) {
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const router = useRouter();
    const t = useTranslations();

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                router.push(`/${locale}`);
                router.refresh();
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <Card className="mb-6 bg-white border-0 shadow-sm">
            <div className="p-6">
                <div className="flex items-center justify-between">
                    {/* Title */}
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                        {subtitle && (
                            <p className="text-gray-600 mt-1">{subtitle}</p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-4">
                        <div className="hidden sm:block text-sm text-gray-500">
                            {new Date().toLocaleDateString(locale === 'ua' ? 'uk-UA' : 'en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </div>

                        <Button
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            variant="outline"
                            size="sm"
                        >
                            {isLoggingOut ? (
                                <>
                                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600 mr-2"></div>
                                    {t('common.loading')}
                                </>
                            ) : (
                                <>
                                    🚪 {t('common.logout')}
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
}