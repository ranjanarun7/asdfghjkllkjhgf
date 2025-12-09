/**
 * Browser TTS Module
 * Handles Web Speech API interactions with robust error handling and queue management.
 */
export class BrowserTTS {
    constructor() {
        this.synth = window.speechSynthesis;
        this.voices = [];
        this.isReady = false;
        this.currentUtterance = null;
        this.isCancelled = false;
    }

    /**
     * Initializes voices considering browser quirks (Chrome needs onvoiceschanged).
     * @returns {Promise<void>}
     */
    async init() {
        if (this.voices.length > 0) return;

        return new Promise((resolve) => {
            let voices = this.synth.getVoices();
            if (voices.length > 0) {
                this.voices = voices;
                this.isReady = true;
                resolve();
            } else {
                this.synth.onvoiceschanged = () => {
                    this.voices = this.synth.getVoices();
                    this.isReady = true;
                    resolve();
                };

                // Fallback timeout in case event never fires
                setTimeout(() => {
                    if (!this.isReady) {
                        this.voices = this.synth.getVoices(); // try one last time
                        this.isReady = true;
                        resolve();
                    }
                }, 2000);
            }
        });
    }

    /**
     * Finds the best voice for a given language code.
     * @param {string} langCode - 'en', 'hi', 'bn'
     * @returns {SpeechSynthesisVoice|null}
     */
    findVoice(langCode) {
        if (!this.voices.length) return null;

        const langMap = {
            'en': 'en-US',
            'hi': 'hi-IN',
            'bn': 'bn-IN' // Bengali India
        };

        const target = langMap[langCode] || 'en-US';

        // 1. Exact match
        let voice = this.voices.find(v => v.lang === target);
        if (voice) return voice;

        // 2. Prefix match (e.g. en-GB for en)
        const codePrefix = target.split('-')[0];
        voice = this.voices.find(v => v.lang.startsWith(codePrefix));
        if (voice) return voice;

        // 3. Name match (fuzzy)
        if (langCode === 'hi') return this.voices.find(v => v.name.toLowerCase().includes('hindi'));
        if (langCode === 'bn') return this.voices.find(v => v.name.toLowerCase().includes('bengali') || v.name.toLowerCase().includes('bangla'));

        return null;
    }

    /**
     * Checks if voices are available for all segments.
     * @param {Array} segments 
     * @returns {boolean}
     */
    hasVoicesFor(segments) {
        return segments.every(seg => !!this.findVoice(seg.language));
    }

    /**
     * Cancels any active speech.
     */
    cancel() {
        this.isCancelled = true;
        this.synth.cancel();
        this.currentUtterance = null;
    }

    /**
     * Plays segments sequentially.
     * @param {Array<{text, language}>} segments 
     * @param {Object} options { rate, volume, onStart, onEnd, onError }
     * @returns {Promise<{ok: boolean, reason?: string}>}
     */
    async speakSegments(segments, options = {}) {
        this.isCancelled = false;
        await this.init();

        // Check availability
        // If specific language voices are missing, we return false to trigger server fallback.
        // BUT per recent user fix, we might want to be lenient? 
        // User request "Step 3" specifically asks: "Detect missing language voices and return {ok: false, segments} for server fallback"
        // So I should enforce strict check here to enable the server fallback feature.
        if (!this.hasVoicesFor(segments)) {
            return { ok: false, reason: 'missing-voice', segments };
        }

        return new Promise((resolve, reject) => {
            let index = 0;

            const speakNext = () => {
                if (this.isCancelled) {
                    resolve({ ok: false, reason: 'cancelled' });
                    return;
                }

                if (index >= segments.length) {
                    resolve({ ok: true });
                    return;
                }

                const seg = segments[index];
                const utterance = new SpeechSynthesisUtterance(seg.text);
                const voice = this.findVoice(seg.language);

                if (voice) {
                    utterance.voice = voice;
                    utterance.lang = voice.lang;
                }

                utterance.rate = options.rate || 1;
                utterance.volume = options.volume || 1;

                utterance.onstart = () => {
                    options.onStart && options.onStart(index, seg);
                };

                utterance.onend = () => {
                    index++;
                    // Chain next immediately
                    speakNext();
                };

                utterance.onerror = (e) => {
                    // unexpected-error, not-allowed, interruption
                    if (e.error === 'interrupted' || e.error === 'canceled') {
                        // Intentional stop
                        resolve({ ok: false, reason: 'interrupted' });
                    } else {
                        console.warn("Utterance error", e);
                        // Skip and continue? or Fail?
                        // Let's try to continue next segment
                        options.onError && options.onError(e);
                        index++;
                        speakNext();
                    }
                };

                this.currentUtterance = utterance;
                this.synth.speak(utterance);
            };

            speakNext();
        });
    }
}

export const browserTTS = new BrowserTTS();
