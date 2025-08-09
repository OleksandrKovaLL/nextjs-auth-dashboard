import { getTranslations } from 'next-intl/server';
import { getCurrentUser } from '@/lib/jwt';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from "next/link";
import LanguageSwitcher from '@/components/LanguageSwitcher';

type Props = {
    params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
    const { locale } = await params;
    const t = await getTranslations();
    let user = null;

    try {
        user = await getCurrentUser();
    } catch (error) {
        console.log('Auth check failed:', error);
    }

    const isAuthenticated = !!user;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            {/* Header */}
            <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold text-lg">T</span>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">TestApp</h1>
                                <p className="text-xs text-gray-500">Next.js Dashboard</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            {/* Language Switcher */}
                            <LanguageSwitcher currentLocale={locale} variant="inline" />

                    {/* Auth buttons */}
                    {isAuthenticated ? (
                        <div className="flex items-center space-x-3">
                            <Badge variant="secondary" className="hidden sm:inline-flex">
                                {user?.name || "User name"}
                            </Badge>
                            <Link href={`/${locale}/dashboard`}>
                                <Button>{t('navigation.dashboard')}</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-3">
                            <Link href={`/${locale}/login`}>
                                <Button variant="ghost">{t('common.login')}</Button>
                            </Link>
                            <Link href={`/${locale}/register`}>
                                <Button>{t('common.register')}</Button>
                            </Link>
                        </div>
                    )}
                </div>
        </div>
</div>
</header>

    {/* Main Content */}
    <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
            {/* CTA Section */}
            {isAuthenticated ? (
                <Card className="max-w-md mx-auto border-green-200 bg-green-50">
                        <CardHeader>
                            <CardTitle className="text-green-800">
                                ✅ {t('home.welcomeBack')}, {user?.name || 'User name'}!
                            </CardTitle>
                            <CardDescription>
                                {t('home.accountReady')}
                            </CardDescription>
                        </CardHeader>
                    <CardContent>
                        <Link href={`/${locale}/dashboard`}>
                            <Button size="lg" className="w-full bg-green-600 hover:bg-green-700">
                                {t('navigation.dashboard')} →
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <Card className="max-w-md mx-auto">
                        <CardHeader>
                            <CardTitle>{t('home.getStarted')}</CardTitle>
                            <CardDescription>
                                {t('home.createOrLogin')}
                            </CardDescription>
                        </CardHeader>
                    <CardContent className="space-y-3">
                        <Link href={`/${locale}/register`}>
                            <Button size="lg" className="w-full">
                                🚀 {t('common.register')}
                            </Button>
                        </Link>
                        <Link href={`/${locale}/login`}>
                            <Button size="lg" variant="outline" className="w-full">
                                👋 {t('common.login')}
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            )}
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="border-blue-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                        <span className="text-2xl">🔐</span>
                    </div>
                    <CardTitle className="text-xl">
                        {t('home.authenticationFeature')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <CardDescription>
                        {t('home.authenticationDetails')}
                    </CardDescription>
                </CardContent>
            </Card>

            <Card className="border-green-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                        <span className="text-2xl">🌐</span>
                    </div>
                    <CardTitle className="text-xl">
                        {t('home.multiLanguageFeature')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <CardDescription>
                        {t('home.multiLanguageDetails')}
                    </CardDescription>
                </CardContent>
            </Card>

            <Card className="border-purple-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                        <span className="text-2xl">📊</span>
                    </div>
                    <CardTitle className="text-xl">
                        {t('home.dashboardFeature')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <CardDescription>
                        {t('home.dashboardDetails')}
                    </CardDescription>
                </CardContent>
            </Card>
        </div>
    </main>
</div>
);
}