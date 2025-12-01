import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Loader2 } from 'lucide-react';
import { LANGUAGE_OPTIONS } from '../constant';

export const InputArea = ({ onSendMessage, isLoading, language }) => {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);

  const handleSubmit = () => {
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    const SpeechRecognitionConstructor =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognitionConstructor) {
      recognitionRef.current = new SpeechRecognitionConstructor();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => (prev ? prev + ' ' : '') + transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech error', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, []);

  useEffect(() => {
    if (recognitionRef.current) {
      const langConfig = LANGUAGE_OPTIONS.find((opt) => opt.value === language);
      if (langConfig && langConfig.speechCode) {
        recognitionRef.current.lang = langConfig.speechCode;
      }
    }
  }, [language]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }
  }, [input]);

  const placeholderText =
    language === 'English'
      ? 'Ask about Ranchi, waterfalls, or culture...'
      : `Ask about Jharkhand in ${language}...`;

  return (
    <div className="max-w-3xl mx-auto w-full">
      <div
        className={`relative flex items-end gap-2 p-2 bg-white rounded-[2rem] border border-gray-200 shadow-xl shadow-gray-200/50 transition-all ${
          isLoading
            ? 'opacity-70 pointer-events-none'
            : 'focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500/20'
        }`}
      >
        <button
          onClick={toggleListening}
          disabled={isLoading}
          className={`p-3 rounded-full transition-all duration-200 hover:bg-gray-100 ${
            isListening
              ? 'bg-red-50 text-red-500 animate-pulse'
              : 'text-gray-400'
          }`}
          title="Speak"
        >
          {isListening ? <MicOff size={22} /> : <Mic size={22} />}
        </button>

        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? 'Listening...' : placeholderText}
          className="flex-1 py-3 bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 resize-none max-h-[120px] scrollbar-hide"
          rows={1}
          disabled={isLoading}
        />

        <button
          onClick={handleSubmit}
          disabled={!input.trim() || isLoading}
          className={`p-3 rounded-full transition-all duration-200 shadow-sm ${
            input.trim() && !isLoading
              ? 'bg-emerald-600 text-black hover:bg-emerald-700 hover:shadow-md transform hover:-translate-y-0.5'
              : 'bg-gray-100 text-gray-300 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <Loader2 size={22} className="animate-spin" />
          ) : (
            <Send size={22} />
          )}
        </button>
      </div>

      {isListening && (
        <div className="text-center text-xs mt-3 text-emerald-600 font-medium animate-pulse">
          Listening... Speak now
        </div>
      )}
    </div>
  );
};
