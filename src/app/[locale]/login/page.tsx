'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

type Props = {
    params: Promise<{ locale: string }>;
};

export default function LoginPage({ params }: Props) {
    const [locale, setLocale] = useState<string>('');
    const router = useRouter();
    const t = useTranslations();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const getLocale = async () => {
            const { locale: paramLocale } = await params;
            setLocale(paramLocale);
        };
        getLocale();
    }, [params]);

    if (!locale) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        if (!formData.email.trim()) {
            setError(t('auth.emailRequired'));
            setIsLoading(false);
            return;
        }

        if (!formData.password) {
            setError(t('auth.passwordRequired'));
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(t('auth.loginSuccess'));

                    console.log('🔄 Checking authentication status...');
                    try {
                        const checkResponse = await fetch('/api/auth/me', {
                            credentials: 'include',
                        });
                        
                        if (checkResponse.ok) {
                            const urlParams = new URLSearchParams(window.location.search);
                            const redirectTo = urlParams.get('redirect') || `/${locale}/dashboard`;

                            router.push(redirectTo);
                        } else {
                            setError(t('auth.authCheckError'));
                        }
                    } catch (error) {
                        console.error('Auth check error:', error);
                        setError(t('common.networkError'));
                    }
            } else {
                setError(data.error || t('auth.loginError'));
            }
        } catch (error) {
            console.error('Login error:', error);
            setError(t('common.networkError'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <Card className="shadow-xl">
                    <CardHeader className="space-y-1 text-center">
                        <CardTitle className="text-2xl font-bold">
                            {t('auth.loginTitle')}
                        </CardTitle>
                        <CardDescription>
                            {t('auth.dontHaveAccount')}{' '}
                            <Link
                                href={`/${locale}/register`}
                                className="text-blue-600 hover:text-blue-500 font-medium underline"
                            >
                                {t('common.register')}
                            </Link>
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <Alert variant="destructive">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            {success && (
                                <Alert className="border-green-200 bg-green-50">
                                    <AlertDescription className="text-green-800">{success}</AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email">{t('auth.email')}</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    placeholder={t('auth.emailPlaceholder')}
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">{t('auth.password')}</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    placeholder={t('auth.passwordEnter')}
                                    value={formData.password}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        {t('auth.loggingIn')}
                                    </>
                                ) : (
                                    t('common.login')
                                )}
                            </Button>
                        </form>

                        <div className="text-center">
                            <Link
                                href={`/${locale}`}
                                className="text-sm text-gray-600 hover:text-gray-800"
                            >
                                ← {t('common.backToHome')}
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}