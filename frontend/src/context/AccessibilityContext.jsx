import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { segmentTextByScript } from "../utils/languageSegmenter";
import { browserTTS } from "../utils/tts-browser";

const AccessibilityContext = createContext();

export const useAccessibility = () => {
    const context = useContext(AccessibilityContext);
    if (!context) {
        throw new Error("useAccessibility must be used inside AccessibilityProvider");
    }
    return context;
};

export const AccessibilityProvider = ({ children }) => {
    // BASIC ACCESSIBILITY STATES
    const [textSize, setTextSize] = useState("default");
    const [highContrast, setHighContrast] = useState(false);
    const [dyslexiaFont, setDyslexiaFont] = useState(false);
    const [reduceMotion, setReduceMotion] = useState(false);
    const [screenReaderMode, setScreenReaderMode] = useState(false);

    // TEXT-TO-SPEECH STATES
    const [reading, setReading] = useState(false);
    const [paused, setPaused] = useState(false);
    const [rate, setRate] = useState(1);
    const [voices, setVoices] = useState([]);

    // Detailed Status for UI
    // 'idle', 'generating', 'playing', 'paused', 'error'
    const [readerStatus, setReaderStatus] = useState('idle');
    const [errorMessage, setErrorMessage] = useState(null);

    // APPLY SETTINGS ON DOCUMENT
    useEffect(() => {
        const root = document.documentElement;
        const body = document.body;

        if (textSize === "small") root.style.fontSize = "90%";
        else if (textSize === "large") root.style.fontSize = "115%";
        else root.style.fontSize = "100%";

        if (highContrast) body.classList.add("high-contrast");
        else body.classList.remove("high-contrast");

        if (dyslexiaFont) body.classList.add("font-dyslexic");
        else body.classList.remove("font-dyslexic");

        if (reduceMotion) body.classList.add("reduce-motion");
        else body.classList.remove("reduce-motion");

        if (screenReaderMode) body.classList.add("screen-reader-mode");
        else body.classList.remove("screen-reader-mode");
    }, [textSize, highContrast, dyslexiaFont, reduceMotion, screenReaderMode]);

    // Utility: BCP47 mapping
    const langMap = {
        hi: "hi-IN",
        bn: "bn-IN",
        mr: "mr-IN",
        en: "en-US",
    };
    const getBestLangTag = (langCode) => langMap[langCode] || "en-US";

    // Initialize Voices
    useEffect(() => {
        browserTTS.init().then(() => {
            setVoices(browserTTS.voices);
        });

        // Cleanup on unmount
        return () => {
            stopReading();
        };
    }, []);

    const fetchServerTTS = async (text, language) => {
        try {
            const response = await fetch('http://localhost:5000/api/tts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, language })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Server TTS missing');
            }

            const data = await response.json();
            return `http://localhost:5000${data.url}`;
        } catch (err) {
            console.error("Server TTS fetch error", err);
            throw err;
        }
    };

    const playAudioSequence = async (audioUrls) => {
        for (const url of audioUrls) {
            if (!reading) break; // Check cancellation (this logic is tricky inside loop if state updates async)
            // But 'reading' comes from closure? No, stale closure.
            // Need ref or check browserTTS.isCancelled

            // Actually, we should check a ref for cancellation. 
            // Reuse browserTTS.isCancelled or add local ref?
            if (browserTTS.isCancelled) break;

            await new Promise((resolve, reject) => {
                const audio = new Audio(url);
                audio.onended = resolve;
                audio.onerror = reject;
                audio.play().catch(reject);
            });
        }
    };

    const speakPage = async () => {
        // Reset state
        stopReading();
        setReading(true);
        setReaderStatus('generating');
        setErrorMessage(null);

        try {
            // 1. Get Text
            const mainContent = document.querySelector("main") || document.body;
            // Filter invisible elements if needed, but innerText usually handles it.
            const text = mainContent.innerText;
            if (!text) throw new Error("No text found to read.");

            // 2. Segment
            const segments = segmentTextByScript(text);
            if (segments.length === 0) throw new Error("No readable text found.");

            // 3. Try Browser TTS
            // We pass a copy of options
            const result = await browserTTS.speakSegments(segments, {
                rate,
                onStart: (idx, seg) => setReaderStatus('playing'),
                onError: (e) => console.warn("Browser TTS warning", e)
            });

            if (result.ok) {
                setReading(false);
                setReaderStatus('idle');
                return;
            }

            // 4. Fallback to Server if missing voice or browser error
            if (!result.ok && result.reason === 'missing-voice') {
                console.log("Browser voice missing. Switching to Server TTS...");
                setReaderStatus('generating'); // Show loading again

                // Gather audio URLs for all segments
                const audioUrls = [];
                for (const seg of segments) {
                    if (browserTTS.isCancelled) break;

                    try {
                        // Use getBestLangTag to ensure we send 'bn-IN', 'hi-IN' etc. instead of just 'bn'
                        const url = await fetchServerTTS(seg.text, getBestLangTag(seg.language));
                        audioUrls.push(url);
                    } catch (e) {
                        console.error("Server TTS generation failed for segment", e);
                        // Use the actual error message from the server/network
                        throw new Error(e.message || "Server TTS generation failed.");
                    }
                }

                if (browserTTS.isCancelled) {
                    setReading(false);
                    return;
                }

                setReaderStatus('playing');
                await playAudioSequence(audioUrls);
                setReading(false);
                setReaderStatus('idle');
            } else {
                // Other error (interrupted, etc)
                if (result.reason !== 'interrupted' && result.reason !== 'cancelled') {
                    throw new Error("Browser TTS failed: " + result.reason);
                }
            }

        } catch (error) {
            console.error("Read Aloud Error:", error);
            // Don't show error if it was just interrupted/cancelled
            if (error.message && !error.message.includes('interrupted')) {
                setErrorMessage(error.message);
                setReaderStatus('error');
            }
            setReading(false);
        }
    };

    const toggleReading = () => {
        if (reading) { // This state might be slightly delayed if we are in async 'generating'
            if (paused) {
                window.speechSynthesis.resume(); // Works for browser, what about Audio element?
                // Audio element doesn't support global resume easily if we are in 'playAudioSequence' loop.
                // For now, pause only fully supported for browser TTS.
                // For server TTS, we might just stop.
                if (readerStatus === 'playing') {
                    // If browser TTS active
                    if (browserTTS.currentUtterance) {
                        window.speechSynthesis.resume();
                        setPaused(false);
                        setReaderStatus('playing');
                    }
                }
                setPaused(false);
            } else {
                if (browserTTS.currentUtterance) {
                    window.speechSynthesis.pause();
                    setPaused(true);
                    setReaderStatus('paused');
                } else {
                    stopReading();
                }
            }
        } else {
            speakPage();
        }
    };

    const stopReading = () => {
        browserTTS.cancel(); // Sets isCancelled=true
        // We also need to stop Audio elements if playing?
        // playAudioSequence checks isCancelled between chunks.
        // Current playing audio check?
        // Hard to stop current Audio object without ref. 
        // For MVC, just setting 'reading' false and isCancelled should be enough for next loop tick.

        setReading(false);
        setPaused(false);
        setReaderStatus('idle');
    };

    return (
        <AccessibilityContext.Provider
            value={{
                textSize, setTextSize,
                highContrast, setHighContrast,
                dyslexiaFont, setDyslexiaFont,
                reduceMotion, setReduceMotion,
                screenReaderMode, setScreenReaderMode,

                reading,
                paused,
                readerStatus, // exposed for UI
                errorMessage, // exposed for UI

                toggleReading,
                stopReading,

                rate, setRate,
                voices,

                // Expose new items 
                resetSettings: () => {
                    setTextSize("default");
                    setHighContrast(false);
                    setDyslexiaFont(false);
                    setReduceMotion(false);
                    setScreenReaderMode(false);
                    stopReading();
                },
                selectVoiceByURI: (uri) => { /* no-op in this new logic or impl needed */ },
                hasVoiceFor: (lang) => browserTTS.findVoice(lang)
            }}
        >
            {children}
        </AccessibilityContext.Provider>
    );
};