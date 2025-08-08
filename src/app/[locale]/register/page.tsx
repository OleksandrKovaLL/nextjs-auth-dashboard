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

export default function RegisterPage({ params }: Props) {
    const [locale, setLocale] = useState<string>('');
    const router = useRouter();
    const t = useTranslations();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Отримуємо locale з params
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

        if (!formData.name.trim()) {
            setError(t('auth.nameRequired'));
            setIsLoading(false);
            return;
        }

        if (!formData.email.trim()) {
            setError(t('auth.emailRequired'));
            setIsLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError(t('auth.passwordMin'));
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(t('auth.registerSuccess'));
                setTimeout(() => {
                    router.push(`/${locale}/dashboard`);
                    router.refresh();
                }, 1000);
            } else {
                setError(data.error || t('auth.registerError'));
            }
        } catch (error) {
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <Card className="shadow-xl">
                    <CardHeader className="space-y-1 text-center">
                        <CardTitle className="text-2xl font-bold">
                            {t('auth.registerTitle')}
                        </CardTitle>
                        <CardDescription>
                            {t('auth.alreadyHaveAccount')}{' '}
                            <Link
                                href={`/${locale}/login`}
                                className="text-blue-600 hover:text-blue-500 font-medium underline"
                            >
                                {t('common.login')}
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
                                <Label htmlFor="name">{t('auth.name')}</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    placeholder={t('auth.namePlaceholder')}
                                    value={formData.name}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                            </div>

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
                                    placeholder={t('auth.passwordPlaceholder')}
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
                                        {t('auth.registering')}
                                    </>
                                ) : (
                                    t('common.register')
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