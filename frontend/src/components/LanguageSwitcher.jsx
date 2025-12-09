import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Globe, Loader2 } from 'lucide-react';

const languages = [
    { code: 'en', label: 'English', nativeLabel: 'English' },
    { code: 'hi', label: 'Hindi', nativeLabel: 'हिंदी' },
    { code: 'bn', label: 'Bengali', nativeLabel: 'বাংলা' },
    { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी' }
];

export default function LanguageSwitcher() {
    const { i18n, t } = useTranslation();
    const [isChanging, setIsChanging] = useState(false);
    const [error, setError] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const changeLanguage = async (lng) => {
        if (isChanging) return;

        if (!languages.find(l => l.code === lng)) {
            setError(t('errors.languageNotSupported'));
            return;
        }

        setIsChanging(true);
        setError(null);

        try {
            await i18n.changeLanguage(lng);
            try {
                localStorage.setItem('i18nextLng', lng);
            } catch (storageError) {
                console.warn('localStorage not available:', storageError);
            }
            setIsOpen(false);
        } catch (err) {
            console.error('Language change failed:', err);
            setError(t('errors.translationLoadFailed'));
            if (lng !== 'en') {
                try {
                    await i18n.changeLanguage('en');
                } catch (fallbackErr) {
                    console.error('Fallback to English failed:', fallbackErr);
                }
            }
        } finally {
            setIsChanging(false);
        }
    };

    return (
        <div className="relative">
            {error && (
                <div className="absolute top-full mt-2 w-48 bg-red-50 text-red-600 text-xs p-2 rounded shadow-lg z-50">
                    {error}
                </div>
            )}

            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={isChanging}
                className="flex items-center gap-2 px-4 py-2 bg-white border rounded-full hover:bg-gray-50 transition-colors shadow-sm text-gray-700 font-medium"
                aria-label="Select Language"
            >
                {isChanging ? <Loader2 size={18} className="animate-spin" /> : <Globe size={18} />}
                <span>{languages.find(l => l.code === i18n.language)?.nativeLabel || 'English'}</span>
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                    {languages.map(lang => (
                        <button
                            key={lang.code}
                            onClick={() => changeLanguage(lang.code)}
                            disabled={isChanging}
                            className={`w-full text-left px-4 py-3 text-sm flex items-center justify-between hover:bg-gray-50 transition-colors
                ${i18n.language === lang.code ? 'text-green-600 font-bold bg-green-50' : 'text-gray-700'}
              `}
                        >
                            <span>{lang.nativeLabel}</span>
                            {i18n.language === lang.code && <Check size={16} />}
                            {isChanging && i18n.language === lang.code && <Loader2 size={16} className="animate-spin ml-2" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}