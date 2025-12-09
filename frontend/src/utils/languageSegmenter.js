/**
 * Splits text into segments based on Unicode script ranges.
 * Supports: Bengali, Hindi (Devanagari), and English (Latin/Default).
 * 
 * @param {string} text - The input text to segment.
 * @returns {Array<{text: string, language: 'en'|'hi'|'bn', pronunciation: null}>}
 */
export const segmentTextByScript = (text) => {
    if (!text || typeof text !== 'string') return [];

    const segments = [];
    let currentSegment = null;

    // Helper to detect language of a character
    const getLang = (char) => {
        const code = char.charCodeAt(0);
        // Bengali: U+0980 - U+09FF
        if (code >= 0x0980 && code <= 0x09FF) return 'bn';
        // Devanagari (Hindi): U+0900 - U+097F
        if (code >= 0x0900 && code <= 0x097F) return 'hi';
        // Treat whitespace/punctuation as "neutral" - inherits previous language or defaults to en
        // But for strict ranges, we usually restart. 
        // Strategy: 
        // If neutral, attach to current segment if exists. 
        // If starting new with neutral, usually it's fine to default to 'en', 
        // but if it's sandwiched between same scripts, it should merge.
        if (/[0-9\s.,;—\-!?"'():]/.test(char)) return 'neutral';
        return 'en';
    };

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        let lang = getLang(char);

        if (lang === 'neutral') {
            // If we have an active segment, append to it
            if (currentSegment) {
                currentSegment.text += char;
            } else {
                // Starting with neutral? Default to 'en' or wait? 
                // Let's start an 'en' segment simply.
                currentSegment = { text: char, language: 'en', pronunciation: null };
            }
        } else {
            // Specific language found
            if (!currentSegment) {
                currentSegment = { text: char, language: lang, pronunciation: null };
            } else if (currentSegment.language === lang) {
                currentSegment.text += char;
            } else if (currentSegment.language === 'en' && getLang(currentSegment.text.trim()[0]) === 'neutral' && segments.length > 0 && segments[segments.length - 1].language === lang) {
                // If current segment is 'en' but effectively only contained neutrals, 
                // and we are switching to 'lang', maybe we should have attached those neutrals to the previous 'lang' segment?
                // This is a complex case. 
                // Simple approach: Close current, start new.

                // Edge case: if current segment is purely neutral (assigned 'en'), re-assign it to the new lang?
                // Check if current segment has any actual English letters?
                const hasEnglishChars = /[a-zA-Z]/.test(currentSegment.text);
                if (!hasEnglishChars) {
                    // It was just punctuation/spaces. Adopt new language.
                    currentSegment.language = lang;
                    currentSegment.text += char;
                } else {
                    segments.push(currentSegment);
                    currentSegment = { text: char, language: lang, pronunciation: null };
                }
            } else {
                // Different language
                segments.push(currentSegment);
                currentSegment = { text: char, language: lang, pronunciation: null };
            }
        }
    }

    if (currentSegment) {
        segments.push(currentSegment);
    }

    // Post-processing: Merge adjacent same-language segments (if logic above missed any edge cases)
    // and filter empty/whitespace-only segments unless meaningful?
    // User requirement: "Merge adjacent same-language segments"
    const merged = [];
    for (const seg of segments) {
        if (!seg.text.trim()) continue; // Skip empty segments

        if (merged.length > 0 && merged[merged.length - 1].language === seg.language) {
            merged[merged.length - 1].text += seg.text;
        } else {
            merged.push(seg);
        }
    }

    return merged;
};