import React from 'react';
import { X, Clock, MapPin, Calendar, Trash2 } from 'lucide-react';
import { getTranslation } from '../translations';

// Assuming ItineraryResponse is defined elsewhere, but we'll use a type-like structure in the interface
/**
 * @typedef {object} ItineraryResponse
 * @property {string} id
 * @property {string} language
 * @property {number} [createdAt] - timestamp
 * @property {string} summary_text
 * @property {Array<any>} itinerary - The actual itinerary steps (length is used for days)
 * @property {object} ui_suggestions
 * @property {Array<string>} ui_suggestions.tags
 */

/**
 * @interface HistorySidebarProps
 * @property {boolean} isOpen
 * @property {() => void} onClose
 * @property {ItineraryResponse[]} history
 * @property {(item: ItineraryResponse) => void} onSelect
 * @property {(id: string) => void} onDelete
 * @property {string} currentLanguage
 */

/**
 * @type {React.FC<HistorySidebarProps>}
 */
export const HistorySidebar = ({
  isOpen,
  onClose,
  history,
  onSelect,
  onDelete,
  currentLanguage
}) => {
  const t = (key) => getTranslation(currentLanguage, key);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4 border-b flex justify-between items-center bg-primary-50">
          <h2 className="text-xl font-bold text-primary-800 flex items-center gap-2">
            <Clock size={20} /> {t('history')}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-primary-100 rounded-full text-primary-600">
            <X size={24} />
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100%-64px)] p-4 space-y-4">
          {history.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">
              <p>No saved itineraries yet.</p>
            </div>
          ) : (
            history.map((item) => (
              <div 
                key={item._id} 
                className="bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow p-3 cursor-pointer group relative"
                onClick={() => onSelect(item)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-800 line-clamp-1 pr-6">
                    {item.title || item.full_itinerary?.ui_suggestions?.tags?.[0] || 'Jharkhand Trip'}

                  </h3>
                  <button 
  onClick={(e) => {
    e.stopPropagation();
    console.log("SIDEBAR SEND ID:", item._id || item.id);
    onDelete(item._id || item.id);
  }}
  className="absolute top-3 right-3 text-gray-300 hover:text-red-500 transition-colors"
>
  <Trash2 size={16} />
</button>

                </div>
                
                <div className="text-xs text-gray-500 space-y-1">
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    <span>{new Date(item.createdAt || Date.now()).toLocaleDateString()}</span>
                  </div>
                   <div className="flex items-center gap-1">
                    <MapPin size={12} />
                    <span>{item.full_itinerary?.itinerary?.length || item.itinerary?.length || 0} Days • {item.full_itinerary?.language || item.language || ''}</span>
                  </div>
                </div>
                
                <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                  {item.full_itinerary?.summary_text || item.summary_text || "No summary available"}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};