'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/LanguageSwitcher';

interface SidebarProps {
    locale: string;
    userName?: string;
}

export default function Sidebar({ locale, userName }: SidebarProps) {
    const pathname = usePathname();
    const t = useTranslations();

    const menuItems = [
        {
            href: `/${locale}/dashboard`,
            label: t('navigation.dashboard'),
            icon: '🏠',
            description: t('sidebar.menu.dashboardDesc'),
        },
        {
            href: `/${locale}/dashboard/products`,
            label: t('navigation.products'),
            icon: '📦',
            description: t('sidebar.menu.productsDesc'),
        },
        {
            href: `/${locale}/dashboard/profile`,
            label: t('navigation.profile'),
            icon: '👤',
            description: t('sidebar.menu.profileDesc'),
        },
    ];

    const isActive = (href: string) => pathname === href;

    return (
        <div className="w-64 min-h-screen bg-gray-50 border-r border-gray-200 p-4">
            {/* User Info */}
            <Card className="p-4 mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {userName?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                            {userName || t('sidebar.user')}
                        </h3>
                        <Badge variant="secondary" className="text-xs">
                            {t('sidebar.active')}
                        </Badge>
                    </div>
                </div>
            </Card>

            {/* Language Switcher */}
            <div className="mb-6 border-t border-gray-200">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    {t('sidebar.language')}
                </h4>
                <LanguageSwitcher currentLocale={locale} variant="sidebar" />
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-2">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    {t('sidebar.navigation')}
                </h4>

                {menuItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`group block p-3 rounded-lg transition-all duration-200 ${
                            isActive(item.href)
                                ? 'bg-blue-100 text-blue-900 shadow-sm border border-blue-200'
                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                    >
                        <div className="flex items-center space-x-3">
                              <span className={`text-xl ${isActive(item.href) ? 'scale-110' : 'group-hover:scale-110'} transition-transform`}>
                                {item.icon}
                              </span>
                            <div className="flex-1">
                                <div className={`font-medium ${isActive(item.href) ? 'text-blue-900' : 'text-gray-900'}`}>
                                    {item.label}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {item.description}
                                </div>
                            </div>
                            {isActive(item.href) && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                        </div>
                    </Link>
                ))}
            </nav>
        </div>
    );
}