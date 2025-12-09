import React, { useState, useContext } from "react";
import {
    Accessibility,
    X,
    Type,
    Monitor,
    BookOpen,
    Zap,
    Volume2,
    Play,
    Pause,
    Square,
    RotateCcw
} from "lucide-react";

import { useAccessibility } from "../context/AccessibilityContext";
import { LanguageContext } from "../context/LanguageContext";

const AccessibilityPanel = () => {
    const [open, setOpen] = useState(false);
    const { lang } = useContext(LanguageContext);

    const {
        textSize,
        setTextSize,
        highContrast,
        setHighContrast,
        dyslexiaFont,
        setDyslexiaFont,
        reduceMotion,
        setReduceMotion,
        screenReaderMode,
        setScreenReaderMode,
        reading,
        paused,
        toggleReading,
        stopReading,
        rate,
        setRate,
        resetSettings,
        voices,
        selectVoiceByURI,
        readerStatus,
        errorMessage
    } = useAccessibility();

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setOpen(true)}
                className="fixed bottom-24 right-6 z-[99999999999] w-14 h-14 flex items-center justify-center rounded-full 
                bg-primary hover:opacity-90 shadow-lg shadow-green-200 text-white 
                transition-all hover:scale-110"
                aria-label="Open Accessibility Panel"
            >
                <Accessibility size={26} />
            </button>

            {/* Slide Panel */}
            {open && (
                <div className="fixed bottom-6 right-6 w-[340px] bg-white shadow-2xl rounded-2xl border border-gray-200 z-[9999] animate-slide-up font-sans">

                    {/* Header */}
                    <div className="flex justify-between items-center p-4 bg-primary text-white rounded-t-2xl shadow-sm">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <Accessibility size={20} /> Accessibility
                        </h2>
                        <button onClick={() => setOpen(false)} className="hover:bg-white/20 p-1.5 rounded-full text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* CONTENT */}
                    <div className="p-5 space-y-6 max-h-[65vh] overflow-y-auto accessibility-panel-content">

                        {/* TEXT SIZE */}
                        <section>
                            <div className="flex items-center gap-2 mb-3">
                                <Type size={18} className="text-primary" />
                                <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Text Size</h3>
                            </div>

                            <div className="flex border border-gray-300 rounded-xl overflow-hidden shadow-sm">
                                <button
                                    className={`flex-1 py-2 font-medium transition-colors ${textSize === "small" ? "bg-primary text-white" : "bg-gray-50 text-gray-700 hover:bg-gray-100"}`}
                                    onClick={() => setTextSize("small")}
                                >
                                    A-
                                </button>
                                <button
                                    className={`flex-1 py-2 font-medium border-l border-r border-gray-300 transition-colors ${textSize === "default" ? "bg-primary text-white" : "bg-gray-50 text-gray-700 hover:bg-gray-100"}`}
                                    onClick={() => setTextSize("default")}
                                >
                                    Default
                                </button>
                                <button
                                    className={`flex-1 py-2 font-medium transition-colors ${textSize === "large" ? "bg-primary text-white" : "bg-gray-50 text-gray-700 hover:bg-gray-100"}`}
                                    onClick={() => setTextSize("large")}
                                >
                                    A+
                                </button>
                            </div>
                        </section>

                        {/* TOGGLES */}
                        <div className="space-y-3">
                            <Toggle
                                active={highContrast}
                                onToggle={() => setHighContrast(!highContrast)}
                                icon={<Monitor size={18} />}
                                label="High Contrast"
                                desc="Improves visibility"
                            />

                            <Toggle
                                active={dyslexiaFont}
                                onToggle={() => setDyslexiaFont(!dyslexiaFont)}
                                icon={<BookOpen size={18} />}
                                label="Dyslexia Font"
                                desc="Readable typography"
                            />

                            <Toggle
                                active={reduceMotion}
                                onToggle={() => setReduceMotion(!reduceMotion)}
                                icon={<Zap size={18} />}
                                label="Reduce Motion"
                                desc="Disable animations"
                            />

                            <Toggle
                                active={screenReaderMode}
                                onToggle={() => setScreenReaderMode(!screenReaderMode)}
                                icon={<Monitor size={18} />}
                                label="Screen Reader Mode"
                                desc="Enhanced visual focus"
                            />
                        </div>

                        {/* TEXT TO SPEECH */}
                        <section className="bg-gray-50 p-4 rounded-2xl border border-dotted border-gray-300">

                            <div className="flex items-center gap-2 mb-3">
                                <Volume2 size={18} className="text-primary" />
                                <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">AI Reader</h3>
                            </div>

                            {/* Voice Selector */}
                            {voices && voices.length > 0 && (
                                <div className="mb-4">
                                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Preferred Voice</label>

                                    <select
                                        className="w-full text-sm p-2 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        onChange={(e) => selectVoiceByURI(e.target.value)}
                                        defaultValue=""
                                    >
                                        <option value="" disabled>Select a voice...</option>

                                        {voices.filter(v =>
                                            v.lang.startsWith("hi") ||
                                            v.lang.startsWith("en") ||
                                            v.lang.startsWith("bn")
                                        ).map((v, i) => (
                                            <option key={v.voiceURI + i} value={v.voiceURI}>
                                                {v.name} ({v.lang})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Reader Controls */}
                            {!reading ? (
                                <button
                                    className="w-full bg-primary hover:opacity-90 text-white py-3 rounded-xl flex items-center justify-center gap-2 font-bold shadow-md shadow-green-100 transition-all active:scale-95"
                                    onClick={() => toggleReading(lang)}
                                >
                                    <Play size={20} fill="currentColor" /> Start Reading
                                </button>
                            ) : (
                                <div className="flex flex-col gap-3">

                                    <div className="flex items-center justify-between bg-white border border-green-200 p-3 rounded-xl shadow-sm">

                                        {/* Status Indicator */}
                                        <div className="flex items-center gap-3">
                                            {readerStatus === 'generating' ? (
                                                <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                                            ) : (
                                                <span className="relative flex h-3 w-3">
                                                    <span
                                                        className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 
                                                        ${paused ? "bg-yellow-400" : "bg-green-400"}`}
                                                    ></span>
                                                    <span
                                                        className={`relative inline-flex rounded-full h-3 w-3 
                                                        ${paused ? "bg-yellow-500" : "bg-green-500"}`}
                                                    ></span>
                                                </span>
                                            )}

                                            <span className="text-sm text-gray-800 font-semibold animate-pulse">
                                                {readerStatus === 'generating' ? "Generating audio..." :
                                                    readerStatus === 'error' ? "Error" :
                                                        paused ? "Paused" : "Reading Aloud..."}
                                            </span>
                                        </div>

                                        {/* Buttons */}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => toggleReading(lang)}
                                                className="p-2 bg-gray-100/50 hover:bg-gray-100 border border-gray-200 rounded-lg text-gray-700 transition-colors"
                                            >
                                                {paused ? (
                                                    <Play size={18} fill="currentColor" />
                                                ) : (
                                                    <Pause size={18} fill="currentColor" />
                                                )}
                                            </button>

                                            <button
                                                onClick={stopReading}
                                                className="p-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-500 rounded-lg transition-colors"
                                            >
                                                <Square size={18} fill="currentColor" />
                                            </button>
                                        </div>

                                    </div>

                                </div>
                            )}

                            {/* Error Message */}
                            {errorMessage && (
                                <div className="mt-2 text-xs text-red-500 bg-red-50 p-2 rounded border border-red-100">
                                    {errorMessage}
                                </div>
                            )}

                            {/* SPEED SLIDER */}
                            <div className="mt-4 px-1">
                                <div className="flex justify-between text-xs text-gray-400 font-medium mb-2">
                                    <span>0.5x</span>
                                    <span>1x</span>
                                    <span>2x</span>
                                </div>

                                <input
                                    type="range"
                                    min="0.5"
                                    max="2"
                                    step="0.25"
                                    value={rate}
                                    onChange={(e) => setRate(parseFloat(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                            </div>

                        </section>

                        {/* RESET BUTTON */}
                        <button
                            className="w-full bg-gray-50 hover:bg-gray-100 border border-gray-300 py-3 rounded-xl flex items-center justify-center gap-2 text-gray-600 font-semibold transition-colors text-sm"
                            onClick={resetSettings}
                        >
                            <RotateCcw size={16} /> Reset All Settings
                        </button>

                    </div>
                </div>
            )}
        </>
    );
};

const Toggle = ({ label, desc, icon, active, onToggle }) => (
    <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between p-3 border rounded-xl transition-all duration-200 group
        ${active ? "bg-green-50 border-primary shadow-inner" : "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300"}`}
    >
        <div className="flex items-center gap-3">

            <div className={`p-2 rounded-lg transition-colors 
                ${active ? "bg-white text-primary" : "bg-gray-100 text-gray-400 group-hover:text-gray-600"}`}>
                {icon}
            </div>

            <div className="text-left">
                <p className={`text-sm font-bold ${active ? "text-primary" : "text-gray-700"}`}>
                    {label}
                </p>

                <p className="text-xs text-gray-500">{desc}</p>
            </div>

        </div>

        {/* Switch */}
        <div
            className={`w-11 h-6 rounded-full relative transition-colors duration-300 ease-in-out
            ${active ? "bg-primary" : "bg-gray-300"}`}
        >
            <div
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-md
                ${active ? "translate-x-5" : "translate-x-0"}`}
            ></div>
        </div>

    </button>
);

export default AccessibilityPanel;
