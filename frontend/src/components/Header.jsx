import React, { useState } from 'react';
import { Map as MapIcon, Leaf, Globe, Menu, Search, ChevronDown } from 'lucide-react';
import { LANGUAGE_OPTIONS } from '../constant';

export const Header = ({
  currentLanguage,
  onLanguageChange,
  onToggleSidebar,
  onOpenSearch,
  onOpenMap,
}) => {
  const [isLangOpen, setIsLangOpen] = useState(false);

  return (
    <header className="bg-emerald-700 text-black shadow-lg z-40 flex items-center justify-between px-4 py-3 sticky top-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors md:hidden"
        >
          <Menu size={24} />
        </button>

        <div className="flex items-center gap-3">
          <div className="bg-white p-2 rounded-full hidden sm:block shadow-sm">
            <Leaf className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="flex flex-col">
            <h1 className="font-bold text-lg leading-tight tracking-wide">YatraMitra AI</h1>
            <span className="text-[10px] opacity-80 font-light tracking-wider uppercase hidden sm:block">
              Tourist Assistant
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onOpenMap}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-800/50 hover:bg-emerald-800 transition-colors text-sm font-medium border border-emerald-600"
          title="View Map"
        >
          <MapIcon size={16} />
          <span className="hidden xs:inline">Map</span>
        </button>

        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 hover:bg-white transition-colors text-sm font-medium shadow-sm"
        >
          <Search size={16} />
          <span className="hidden xs:inline">Plans</span>
        </button>

        <div className="relative">
          <button
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500 hover:bg-emerald-600 transition-colors text-sm"
          >
            <Globe size={14} />
            <span className="truncate max-w-[80px]">{currentLanguage}</span>
            <ChevronDown
              size={12}
              className={`transition-transform ${isLangOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {isLangOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsLangOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-56 max-h-80 overflow-y-auto bg-white text-gray-800 rounded-xl shadow-xl border border-gray-100 z-20 py-1">
                {LANGUAGE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      onLanguageChange(opt.value);
                      setIsLangOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-emerald-50 transition-colors ${
                      currentLanguage === opt.value
                        ? 'bg-emerald-50 font-medium text-emerald-700'
                        : ''
                    }`}
                  >
                    <span className="text-xl leading-none">{opt.flag}</span>
                    <span className="text-sm">{opt.label}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
