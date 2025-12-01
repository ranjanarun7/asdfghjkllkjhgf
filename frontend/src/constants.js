// constants.js

/**
 * @typedef {object} LanguageOption
 * @property {string} code - The language code (e.g., 'en', 'hi')
 * @property {string} label - The language name in English and its native script
 * @property {string} flag - The emoji flag
 */

/**
 * List of supported languages for the application.
 * @type {LanguageOption[]}
 */
export const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'हिन्दी – Hindi', flag: '🇮🇳' },
  { code: 'sat', label: 'ᱥᱟᱱᱛᱟᱲᱤ – Santhali', flag: '🇮🇳' },
  { code: 'bn', label: 'বাংলা – Bengali', flag: '🇮🇳' },
  { code: 'gu', label: 'ગુજરાતી – Gujarati', flag: '🇮🇳' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ – Punjabi', flag: '🇮🇳' },
  { code: 'mr', label: 'मराठी – Marathi', flag: '🇮🇳' },
  { code: 'ta', label: 'தமிழ் – Tamil', flag: '🇮🇳' },
  { code: 'kn', label: 'ಕನ್ನಡ – Kannada', flag: '🇮🇳' },
  { code: 'as', label: 'অসমীয়া – Assamese', flag: '🇮🇳' },
  { code: 'sa', label: 'संस्कृतम् – Sanskrit', flag: '🇮🇳' },
  { code: 'ur', label: 'اُردو – Urdu', flag: '🇵🇰' },
  { code: 'fr', label: 'Français – French', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch – German', flag: '🇩🇪' },
  { code: 'ja', label: '日本語 – Japanese', flag: '🇯🇵' },
  { code: 'ko', label: '한국어 – Korean', flag: '🇰🇷' },
  { code: 'zh', label: '中文 – Chinese', flag: '🇨🇳' },
  { code: 'ru', label: 'Русский – Russian', flag: '🇷🇺' },
];

/**
 * List of interests users can select.
 * @type {string[]}
 */
export const INTERESTS = [
  "Nature", "Waterfalls", "Culture", "Wildlife", "Trekking", "Food", "Heritage", "Spiritual"
];

/**
 * System Instruction for the Gemini model to act as an itinerary generator.
 * @type {string}
 */