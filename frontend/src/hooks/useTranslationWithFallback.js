import { useTranslation } from 'react-i18next';

export function useTranslationWithFallback() {
    const { t, i18n, ready } = useTranslation();

    // ERROR HANDLING: Provide fallback for missing keys
    const safeTrans = (key, fallback = '') => {
        try {
            if (!ready) return fallback || '';

            const translation = t(key);

            // Check if translation is actually missing (returns key itself usually, or undefined depending on config)
            // i18next usually returns key if missing unless configured otherwise
            if (translation === key && fallback) {
                return fallback;
            }

            return translation;
        } catch (err) {
            console.error("Translation error for key \"${key}\":", err);
            return fallback || key;
        }
    };

    return {
        t: safeTrans,
        i18n,
        ready,
        isLoading: !ready
    };
}