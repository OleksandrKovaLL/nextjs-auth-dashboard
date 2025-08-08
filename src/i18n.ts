import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export const locales = ['ua', 'en'] as const;

export default getRequestConfig(async ({ locale }) => {

    let candidateLocale = locale;
    if (!candidateLocale || candidateLocale === 'undefined') {
        const cookieStore = await cookies();
        const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value;
        if (cookieLocale && (locales as readonly string[]).includes(cookieLocale)) {
            candidateLocale = cookieLocale as any;
        } else {
            candidateLocale = 'ua';
        }
    }

    const validLocale: string = (locales as readonly string[]).includes(candidateLocale as any)
        ? (candidateLocale as string)
        : 'ua';
    if (validLocale !== candidateLocale) {
    }

    try {
        const messages = (await import(`./messages/${validLocale}.json`)).default;

        return {
            locale: validLocale,
            messages
        };
    } catch (error) {

        return {
            locale: validLocale,
            messages:{}
        };
    }
});