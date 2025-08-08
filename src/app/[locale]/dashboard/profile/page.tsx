'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ProfileData {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
    avatar?: string;
    phone?: string;
    bio?: string;
    location: string;
    preferences: {
        language: string;
        notifications: boolean;
        darkMode: boolean;
    };
    stats: {
        loginCount: number;
        lastLogin: string;
        productsViewed: number;
        favoriteCategory: string;
    };
}

type Props = {
    params: Promise<{ locale: string }>;
};

export default function ProfilePage({ params }: Props) {
    const [locale, setLocale] = useState<string>('');
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const t = useTranslations();

    useEffect(() => {
        const init = async () => {
            const { locale: paramLocale } = await params;
            setLocale(paramLocale);

            try {
                const userResponse = await fetch('/api/auth/me', {
                    credentials: 'include'
                });
                if (!userResponse.ok) {
                    window.location.href = `/${paramLocale}/login`;
                    return;
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                window.location.href = `/${paramLocale}/login`;
                return;
            }

            fetchProfile();
        };

        init();
    }, [params]);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/profile', {
                credentials: 'include'
            });


            if (!response.ok) {
                throw new Error('Failed to fetch profile');
            }

            const data = await response.json();
            setProfile(data.profile);
            console.log("Profile data", data)
        } catch (error) {
            console.error('Error fetching profile:', error);
            setError('Не вдалося завантажити профіль');
        } finally {
            setLoading(false);
        }
    };

    const getRoleLabel = (role: string) => {
        const roles: Record<string, string> = {
            admin: 'Адміністратор',
            user: 'Користувач',
            moderator: 'Модератор'
        };
        return roles[role] || role;
    };

    const getRoleColor = (role: string) => {
        const colors: Record<string, string> = {
            admin: 'bg-red-100 text-red-800',
            user: 'bg-blue-100 text-blue-800',
            moderator: 'bg-green-100 text-green-800'
        };
        return colors[role] || 'bg-gray-100 text-gray-800';
    };

    if (!locale) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar locale={locale} userName={profile?.name} />

            <div className="flex-1 p-6">
                <DashboardHeader
                    locale={locale}
                    title={t('navigation.profile')}
                    subtitle={t('profile.subtitle')}
                />

                {error && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertDescription>{t('profile.loadError')}</AlertDescription>
                    </Alert>
                )}

                {loading ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, i) => (
                            <Card key={i} className="animate-pulse">
                                <CardHeader>
                                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div className="h-3 bg-gray-200 rounded"></div>
                                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : profile ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Main info */}
                        <div className="lg:col-span-1 space-y-6">
                            <Card>
                                <CardHeader className="text-center">
                                    <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl font-bold text-white">
                      {profile.name.charAt(0).toUpperCase()}
                    </span>
                                    </div>
                                    <CardTitle className="text-xl">{profile.name}</CardTitle>
                                    <CardDescription>{profile.email}</CardDescription>
                                    <Badge className={`w-fit mx-auto ${getRoleColor(profile.role)}`}>
                                        {getRoleLabel(profile.role)}
                                    </Badge>
                                </CardHeader>
                                <CardContent className="text-center">
                                    <div className="space-y-2 text-sm text-gray-600">
                                        <p>📍 {profile.location}</p>
                                        <p>📅 {t('profile.registeredAt')}: {new Date(profile.createdAt).toLocaleDateString(locale === 'ua' ? 'uk-UA' : 'en-US')}</p>
                                        <p>🔄 {t('profile.lastUpdate')}: {new Date(profile.updatedAt).toLocaleDateString(locale === 'ua' ? 'uk-UA' : 'en-US')}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        📊 {t('profile.activityStats')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                                            <div className="text-2xl font-bold text-blue-600">
                                                {profile.stats.loginCount}
                                            </div>
                                                <div className="text-sm text-gray-600">{t('profile.logins')}</div>
                                        </div>
                                        <div className="text-center p-4 bg-green-50 rounded-lg">
                                            <div className="text-2xl font-bold text-green-600">
                                                {profile.stats.productsViewed}
                                            </div>
                                                <div className="text-sm text-gray-600">{t('profile.productsViewed')}</div>
                                        </div>
                                        <div className="text-center p-5 bg-orange-50 rounded-lg">
                                            <div className="text-sm pb-2 font-medium text-orange-600">
                                                {new Date(profile.stats.lastLogin).toLocaleDateString('uk-UA')}
                                            </div>
                                                <div className="text-sm text-gray-600">{t('profile.lastLogin')}</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        ⚙️ {t('profile.settings')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <div className="font-medium">{t('profile.language')}</div>
                                                <div className="text-sm text-gray-600">{t('profile.currentLanguage')}</div>
                                            </div>
                                            <Badge variant="secondary">
                                                {profile.preferences.language === 'ua' ? '🇺🇦 Українська' : '🇬🇧 English'}
                                            </Badge>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <div className="font-medium">{t('profile.darkTheme')}</div>
                                                <div className="text-sm text-gray-600">{t('profile.appearance')}</div>
                                            </div>
                                            <Badge variant={profile.preferences.darkMode ? "default" : "secondary"}>
                                                {profile.preferences.darkMode ? '🌙 ' + t('common.dark') : '☀️ ' + t('common.light')}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        🔐 {t('profile.accountSecurity')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">{t('profile.userId')}:</span>
                                            <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                                                ...{profile.id.slice(-8)}
                                            </code>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">{t('profile.accountType')}:</span>
                                            <Badge className={getRoleColor(profile.role)}>
                                                {getRoleLabel(profile.role)}
                                            </Badge>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">{t('profile.emailVerified')}:</span>
                                            <Badge variant="default" className="bg-green-100 text-green-800">
                                                ✅ {t('common.verified')}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                ) : (
                    <Card className="text-center py-12">
                        <CardContent>
                            <div className="text-6xl mb-4">❌</div>
                            <h3 className="text-xl font-semibold mb-2">{t('profile.loadError')}</h3>
                            <Button onClick={fetchProfile}>
                                {t('common.tryAgain')}
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}