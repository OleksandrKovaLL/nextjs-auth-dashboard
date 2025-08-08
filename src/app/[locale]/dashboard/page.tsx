import { getCurrentUser } from '@/lib/jwt';
import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type Props = {
    params: Promise<{ locale: string }>;
};

export default async function DashboardPage({ params }: Props) {
    const { locale } = await params;
    const t = await getTranslations();

    let user;
    try {
        user = await getCurrentUser();
        console.log('🎛️ Dashboard: User check result:', user ? `User: ${user.name}` : 'No user');
    } catch (error) {
        console.error('🎛️ Dashboard: Auth error:', error);
        user = null;
    }
    if (!user) {
        console.log('🎛️ Dashboard: No user found, redirecting to login');
        redirect(`/${locale}/login`);
    }

    const statsCards = [
        {
            title: t('dashboard.stats.totalProducts'),
            value: '24',
            icon: '📦',
            description: t('dashboard.stats.inYourCatalog'),
            color: 'bg-blue-500',
        },
        {
            title: t('dashboard.stats.inStock'),
            value: '18',
            icon: '✅',
            description: t('dashboard.stats.availableForSale'),
            color: 'bg-green-500',
        },
        {
            title: t('dashboard.stats.categories'),
            value: '6',
            icon: '🏷️',
            description: t('dashboard.stats.variousCategories'),
            color: 'bg-purple-500',
        },
        {
            title: t('dashboard.stats.updated'),
            value: 'Сьогодні',
            icon: '🔄',
            description: t('dashboard.stats.lastUpdate'),
            color: 'bg-orange-500',
        },
    ];

    const quickActions = [
        {
            title: t('dashboard.quickActions.viewProducts'),
            description: t('dashboard.quickActions.manageCatalog'),
            icon: '📦',
            href: `/${locale}/dashboard/products`,
            color: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
        },
        {
            title: t('dashboard.quickActions.myProfile'),
            description: t('dashboard.quickActions.accountSettings'),
            icon: '👤',
            href: `/${locale}/dashboard/profile`,
            color: 'bg-green-50 hover:bg-green-100 border-green-200',
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar locale={locale} userName={user.name} />

            <div className="flex-1 p-6">
                <DashboardHeader
                    locale={locale}
                    title="Dashboard"
                    subtitle={`${t('dashboard.welcome')}, ${user.name}`}
                />

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {statsCards.map((stat, index) => (
                        <Card key={index} className="hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between pb-3">
                                <CardTitle className="text-sm font-medium text-gray-600">
                                    {stat.title}
                                </CardTitle>
                                <div className={`p-2 rounded-lg text-white ${stat.color}`}>
                                    <span className="text-lg">{stat.icon}</span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-gray-900 mb-1">
                                    {stat.value}
                                </div>
                                <p className="text-xs text-gray-500">
                                    {stat.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {quickActions.map((action, index) => (
                        <Card key={index} className={`cursor-pointer transition-all ${action.color}`}>
                            <CardHeader>
                                <div className="flex items-center space-x-4">
                                    <div className="text-3xl">{action.icon}</div>
                                    <div>
                                        <CardTitle className="text-lg">{action.title}</CardTitle>
                                        <CardDescription className="mt-1">
                                            {action.description}
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Link href={action.href}>
                                    <Button className="w-full">
                                        {t('common.next')} →
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}