// types.js

/**
 * @typedef {object} ItineraryItem
 * @property {string} time_block - Time segment for the activity (e.g., "Morning/Afternoon/Evening")
 * @property {string} place_name - Name of the place to visit
 * @property {string} category - Category of the place (e.g., "Nature", "Heritage")
 * @property {string} description - Short description of the activity
 * @property {string} approx_travel_time - Estimated time to travel to the next item (e.g., "1 hr 30 min")
 * @property {number} approx_distance_km - Estimated distance in kilometers
 * @property {string} estimated_cost_range_inr - Estimated cost range for the activity (e.g., "₹500 - ₹1000")
 * @property {string[]} safety_notes - Specific safety instructions for this location
 * @property {string} [image_prompt] - Optional visual description for image generation
 */
 
/**
 * @typedef {object} DayPlan
 * @property {number} day - Day number (e.g., 1, 2, 3)
 * @property {string} [date] - Date string in YYYY-MM-DD format (optional)
 * @property {string} title - Title summarizing the day's plan
 * @property {ItineraryItem[]} items - List of planned activities for the day
 * @property {string} day_estimated_cost_range_inr - Estimated cost range for all activities on this day
 */
 
/**
 * @typedef {object} HotelRecommendation
 * @property {string} name - Name of the hotel
 * @property {string} rating - Star rating string (e.g., "4.5 Stars")
 * @property {string} approx_price - Approximate price per night (e.g., "₹3000/night")
 * @property {string} location_note - Note on the hotel's location (e.g., "Near Airport")
 * @property {string} description - Short review/reason for recommendation
 */

/**
 * @typedef {object} ItineraryResponse
 * @property {string} language - Language code used for the text (e.g., 'en', 'hi')
 * @property {string} summary_text - A short, overall summary of the trip
 * @property {object} [arrival_logistics] - Details about arrival and initial accommodation
 * @property {string} arrival_logistics.arrival_mode - Inferred mode of arrival (e.g. "Flight to Ranchi")
 * @property {string} arrival_logistics.advice - Advice on getting to the city center
 * @property {HotelRecommendation[]} arrival_logistics.recommended_hotels - List of recommended accommodations
 * @property {DayPlan[]} itinerary - The core day-by-day itinerary
 * @property {string} total_estimated_cost_range_inr - Total estimated cost range for the entire trip (per person)
 * @property {string[]} recommended_checklist - Items the user should pack
 * @property {string[]} general_safety_notes - General safety tips for the region
 * @property {object} ui_suggestions - Hints for the frontend display
 * @property {boolean} ui_suggestions.show_save_button
 * @property {boolean} ui_suggestions.show_create_new_button
 * @property {string[]} ui_suggestions.tags
 * @property {number} [createdAt] - Client-side timestamp of generation
 * @property {string} [id] - Unique ID for storage/history
 */
 
/**
 * @typedef {object} UserInput
 * @property {string} startDate - Trip start date (YYYY-MM-DD)
 * @property {string} endDate - Trip end date (YYYY-MM-DD)
 * @property {string[]} interests - Selected interests (e.g., ["Nature", "Culture"])
 * @property {('preset'|'custom')} budgetType - Type of budget selection
 * @property {('low'|'mid'|'high')} [budgetLevel] - Budget level if budgetType is 'preset'
 * @property {number} [customBudgetMin] - Minimum custom budget (INR)
 * @property {number} [customBudgetMax] - Maximum custom budget (INR)
 * @property {number} travellers - Number of travellers
 * @property {string} start_city - The starting city for the trip
 */
 
/**
 * @typedef {object} LanguageOption
 * @property {string} code - Language code (e.g., 'en')
 * @property {string} label - Display label (e.g., 'English')
 * @property {string} flag - Emoji flag (e.g., '🇬🇧')
 */

// Export dummy objects or the JSDoc definitions to make them available
// In a modern JS environment, simply defining the JSDocs is enough for intellisense in consuming files.
// We export an empty object or a placeholder just to satisfy module structure if needed,
// but the core value is in the JSDoc types for consumption.

export const DUMMY_EXPORT = true;