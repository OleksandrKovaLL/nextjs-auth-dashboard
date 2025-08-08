'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useTranslations } from 'next-intl';

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    inStock: boolean;
    createdAt: string;
}

type Props = {
    params: Promise<{ locale: string }>;
};

export default function ProductsPage({ params }: Props) {
    const [locale, setLocale] = useState<string>('');
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [user, setUser] = useState<any>(null);
    const t = useTranslations();

    useEffect(() => {
        const init = async () => {
            const { locale: paramLocale } = await params;
            setLocale(paramLocale);

            try {
                const userResponse = await fetch('/api/auth/me', {
                    credentials: 'include'
                });
                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    setUser(userData.user);
                } else {
                    window.location.href = `/${paramLocale}/login`;
                    return;
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                window.location.href = `/${paramLocale}/login`;
                return;
            }

            fetchProducts();
        };

        init();
    }, [params]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/products', {
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }

            const data = await response.json();
            setProducts(data.products || []);
        } catch (error) {
            console.error('Error fetching products:', error);
            setError('Не вдалося завантажити товари');
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat(locale === 'ua' ? 'uk-UA' : 'en-US', {
            style: 'currency',
            currency: 'UAH',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(price * 40);
    };

    const getCategoryLabel = (category: string) => {
        try {
            return t(`categories.${category}`);
        } catch (_) {
            return category;
        }
    };

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            electronics: 'bg-blue-100 text-blue-800',
            clothing: 'bg-purple-100 text-purple-800',
            books: 'bg-green-100 text-green-800',
            home: 'bg-orange-100 text-orange-800',
            sports: 'bg-red-100 text-red-800',
            other: 'bg-gray-100 text-gray-800'
        };
        return colors[category] || 'bg-gray-100 text-gray-800';
    };

    if (!locale || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar locale={locale} userName={user?.name} />

            <div className="flex-1 p-6">
                <DashboardHeader
                    locale={locale}
                    title={t('navigation.products')}
                    subtitle={t('products.subtitle')}
                />

                {error && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertDescription>{t('products.loadError')}</AlertDescription>
                    </Alert>
                )}

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <Card key={i} className="animate-pulse">
                                <CardHeader>
                                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <Card className="text-center py-12">
                        <CardContent>
                            <div className="text-6xl mb-4">📦</div>
                            <h3 className="text-xl font-semibold mb-2">{t('products.emptyTitle')}</h3>
                            <p className="text-gray-600 mb-4">{t('products.emptyDescription')}</p>
                            <Button onClick={fetchProducts}>
                                {t('products.refresh')}
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        {/* Statistics */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium text-gray-600">
                                        {t('dashboard.stats.totalProducts')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-blue-600">
                                        {products.length}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium text-gray-600">
                                        {t('dashboard.stats.inStock')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-green-600">
                                        {products.filter(p => p.inStock).length}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium text-gray-600">
                                        {t('products.outOfStock')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-red-600">
                                        {products.filter(p => !p.inStock).length}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium text-gray-600">
                                        {t('dashboard.stats.categories')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-purple-600">
                                        {new Set(products.map(p => p.category)).size}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Products */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product) => (
                                <Card key={product._id} className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <div className="flex justify-between items-start mb-2">
                                            <CardTitle className="text-lg font-semibold line-clamp-2">
                                                {product.name}
                                            </CardTitle>
                                            <Badge
                                                variant={product.inStock ? "default" : "destructive"}
                                                className="ml-2 shrink-0"
                                            >
                                                {product.inStock ? t('products.inStockBadge') : t('products.notAvailableBadge')}
                                            </Badge>
                                        </div>
                                        <Badge
                                            className={`w-fit ${getCategoryColor(product.category)}`}
                                            variant="secondary"
                                        >
                                            {getCategoryLabel(product.category)}
                                        </Badge>
                                    </CardHeader>

                                    <CardContent>
                                        <CardDescription className="mb-4 line-clamp-3">
                                            {product.description}
                                        </CardDescription>

                                        <div className="flex justify-between items-center">
                                            <div className="text-2xl font-bold text-blue-600">
                                                {formatPrice(product.price)}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {new Date(product.createdAt).toLocaleDateString(locale === 'ua' ? 'uk-UA' : 'en-US')}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}