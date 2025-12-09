import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'en',
        supportedLngs: ['en', 'hi', 'bn', 'mr'],
        debug: process.env.NODE_ENV === 'development',
        ns: ['common'],
        defaultNS: 'common',

        interpolation: {
            escapeValue: false, // React already escapes
        },

        backend: {
            loadPath: '/locales/{{lng}}/{{ns}}.json',
            requestOptions: {
                mode: 'cors',
                credentials: 'same-origin',
                cache: 'default'
            }
        },

        detection: {
            order: ['localStorage', 'navigator', 'htmlTag'],
            caches: ['localStorage'],
            lookupLocalStorage: 'i18nextLng',
            checkWhitelist: true
        },

        load: 'languageOnly',

        react: {
            useSuspense: false,
            bindI18n: 'languageChanged loaded',
            bindI18nStore: 'added removed',
            transEmptyNodeValue: '',
            transSupportBasicHtmlNodes: true,
            transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p']
        },

        saveMissing: false,
        missingKeyHandler: (lngs, ns, key, fallbackValue) => {
            if (process.env.NODE_ENV === 'development') {
                console.warn(`Missing translation key: ${key} for language: ${lngs[0]}`);
            }
        }
    })
    .catch((err) => {
        console.error('i18n initialization failed:', err);
    });

i18n.on('failedLoading', (lng, ns, msg) => {
    console.error(`Failed loading ${lng}/$  g}`);
});

export default i18n;