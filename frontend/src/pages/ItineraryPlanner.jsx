import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HistorySidebar } from '../components/HistorySidebar';
import { ItineraryForm } from '../components/ItineraryForm';
import { ItineraryDisplay } from '../components/ItineraryDisplay';
import { generateItinerary } from '../services/geminiService';
import { Menu, Globe, ArrowLeft } from 'lucide-react';
import { LANGUAGES } from '../constants';
import { getTranslation } from '../translations';

/**
 * @typedef {object} ItineraryResponse - Placeholder for the Itinerary response structure
 */
/**
 * @typedef {object} UserInput - Placeholder for the User Input structure
 * @property {string} language
 */

/**
 * @type {React.FC}
 */
const ItineraryPlanner = () => {
  const navigate = useNavigate();
  const [currentItinerary, setCurrentItinerary] = useState(null); // ItineraryResponse | null
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]); // ItineraryResponse[]
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [error, setError] = useState(null); // string | null
  const [isSaved, setIsSaved] = useState(false);
  const [language, setLanguage] = useState('en'); // Global Language State
  useEffect(() => {
  let uid = localStorage.getItem("userId");
  if (!uid) {
    uid = crypto.randomUUID();    // har browser ka unique id
    localStorage.setItem("userId", uid);
  }
}, []);

  /**
   * @param {UserInput} input
   */
  const handleGenerate = async (input) => {
    setIsLoading(true);
    setError(null);
    setIsSaved(false);
    try {
      // Pass the global language to the service
      const userId = localStorage.getItem("userId");
const inputWithLang = { ...input, language, userId };

      const result = await generateItinerary(inputWithLang);
      console.log('Generated itinerary:', result);
      localStorage.setItem("last_saved_itinerary", JSON.stringify(result));
      setCurrentItinerary(result);
    } catch (err) {
      console.error('Error generating itinerary:', err);
      setError(err.message || getTranslation(language, 'error') || "Failed to generate itinerary.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
  const userId = localStorage.getItem("userId");

  fetch(`${process.env.REACT_APP_BACKEND_URL}/itinerary/history/${userId}`)
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setHistory(data.data);
      }
    });
}, []);


const handleSave = async () => {
  if (!currentItinerary) return;

  const userId = localStorage.getItem("userId");

  try {
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/itinerary/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        itineraryData: currentItinerary,
        userId
      })
    });

    const result = await res.json();

    if (result.success) {
      alert("✅ Itinerary Saved Successfully");
      setIsSaved(true);
    } else {
      alert("❌ Save Failed");
    }

  } catch (err) {
    console.error(err);
    alert("Server error during save");
  }
};


  /**
   * @param {string} id
   */
const handleDeleteHistory = async (id) => {
  console.log("DELETE FRONTEND RECEIVED:", id);

  if (!id) {
    alert("ID missing — delete aborted");
    return;
  }

  // Remove from UI instantly
  setHistory(prev => prev.filter(item => item._id !== id));

  try {
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/itinerary/delete/${id}`, {
      method: "DELETE",
    });

    const result = await res.json();
    console.log("DELETE RESPONSE:", result);

    if (!result.success) {
      alert("Delete failed on server");
    }

  } catch (err) {
    console.error("DELETE ERROR:", err);
    alert("Server delete failed");
  }
};




  /**
   * @param {ItineraryResponse} item
   */
  const handleSelectHistory = (item) => {
  setCurrentItinerary(item.full_itinerary);
  setIsSidebarOpen(false);
  setLanguage(item.full_itinerary.language || 'en');
  setIsSaved(true);
  setError(null);
};


  const handleNew = () => {
    setCurrentItinerary(null);
    setIsSaved(false);
    setError(null);
  };

  /**
   * @param {string} key
   */
  const t = (key) => getTranslation(language, key);

  return (
    <div className="min-h-screen bg-slate-50 relative flex flex-col">
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors font-medium"
              title="Back to Home"
            >
              <ArrowLeft size={20} />
              Back
            </button>
            <div 
              className="flex items-center gap-2 cursor-pointer"
              onClick={handleNew}
            >
              <div>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">YatraMitra</h1>
                <p className="text-xs text-primary-600 font-medium">Jharkhand Tourism AI</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Language Selector in Header */}
            <div className="relative group hidden sm:block">
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200 cursor-pointer hover:border-primary-300">
                <Globe size={16} className="text-gray-600" />
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm font-medium text-gray-700 appearance-none cursor-pointer w-24"
                  disabled={isLoading}
                >
                  {LANGUAGES.map(lang => (
                    <option key={lang.code} value={lang.code}>
                        {lang.label.split(' ')[0]} {lang.flag}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-8">
        {error && (
          <div className="max-w-2xl mx-auto mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <span className="font-bold">{t('error')}:</span> {error}
          </div>
        )}

        {!currentItinerary ? (
          <div className="flex flex-col items-center justify-center space-y-8 animate-fade-in-up">
              <div className="text-center max-w-2xl mx-auto mb-4 px-4">
                <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
                  {t('discoverTitle')} <span className="text-primary-600">Jharkhand</span>
                </h2>
                <p className="text-lg text-gray-600">
                  {t('discoverSubtitle')}
                </p>
              </div>
            <ItineraryForm 
              onSubmit={handleGenerate} 
              isLoading={isLoading} 
              language={language}
            />
          </div>
        ) : (
          <ItineraryDisplay 
            data={currentItinerary} 
            onNew={handleNew}
            onSave={handleSave}
            isSaved={isSaved}
            currentLanguage={language}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} YatraMitra. AI Generated content can be inaccurate.</p>
        </div>
      </footer>

      {/* Sidebar */}
      <HistorySidebar 
  isOpen={isSidebarOpen} 
  onClose={() => setIsSidebarOpen(false)} 
  history={history}
  onSelect={handleSelectHistory}
  onDelete={(id) => handleDeleteHistory(id)}
  currentLanguage={language}
/>

    </div>
  );
};

export default ItineraryPlanner;