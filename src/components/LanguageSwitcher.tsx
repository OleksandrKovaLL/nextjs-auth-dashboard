'use client';

import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

type LanguageSwitcherVariant = 'pill' | 'sidebar' | 'inline';

interface LanguageSwitcherProps {
  currentLocale?: string;
  variant?: LanguageSwitcherVariant;
  className?: string;
}

const SUPPORTED_LOCALES: ReadonlyArray<string> = ['ua', 'en'] as const;

export default function LanguageSwitcher({
  currentLocale,
  variant = 'pill',
  className = ''
}: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();

  const activeLocale = React.useMemo(() => {
    if (currentLocale && SUPPORTED_LOCALES.includes(currentLocale)) return currentLocale;
    if (pathname) {
      const seg = pathname.split('/')[1];
      if (SUPPORTED_LOCALES.includes(seg)) return seg;
    }
    return 'ua';
  }, [currentLocale, pathname]);

  const handleSwitch = (newLocale: string) => {
    if (!pathname || pathname === '/') {
      router.push(`/${newLocale}`);
      return;
    }

    const segments = pathname.split('/');
    const hasLocalePrefix = SUPPORTED_LOCALES.includes(segments[1]);
    if (hasLocalePrefix) {
      segments[1] = newLocale;
      router.push(segments.join('/'));
    } else {
      const rest = pathname.startsWith('/') ? pathname : `/${pathname}`;
      router.push(`/${newLocale}${rest}`);
    }
  };

  const containerCls = (() => {
    switch (variant) {
      case 'sidebar':
        return `flex space-x-2 ${className}`;
      case 'inline':
        return `flex bg-gray-100 rounded-lg p-1 ${className}`;
      case 'pill':
      default:
        return `flex rounded-lg border border-gray-200 bg-gray-50 p-1 ${className}`;
    }
  })();

  const btnCls = (isActive: boolean) => {
    const base = 'px-3 py-1 text-sm font-medium rounded-md transition-colors';
    const active = 'bg-white text-blue-600 shadow-sm';
    const inactive = 'text-gray-600 hover:text-gray-900';
    return `${base} ${isActive ? active : inactive}`;
  };

  return (
    <div className={containerCls}>
      <button
        onClick={() => handleSwitch('ua')}
        className={btnCls(activeLocale === 'ua')}
        aria-pressed={activeLocale === 'ua'}
      >
        UA
      </button>
      <button
        onClick={() => handleSwitch('en')}
        className={btnCls(activeLocale === 'en')}
        aria-pressed={activeLocale === 'en'}
      >
        EN
      </button>
    </div>
  );
}


