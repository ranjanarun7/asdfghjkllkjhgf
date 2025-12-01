const MAX_RETRIES = 5;
const BASE_DELAY_MS = 1000;

/**
 * Handles the fetch request to the Gemini API with exponential backoff for retries.
 */
async function fetchWithExponentialBackoff(apiUrl, payload) {
    // Mandatory empty API key for the Canvas runtime environment
    const apiKey = "AIzaSyAFmChY1cYiIrblnkDuUDJDobvvRov18J8"; 
    const finalUrl = `${apiUrl}?key=${apiKey}`;

    for (let i = 0; i < MAX_RETRIES; i++) {
        try {
            const response = await fetch(finalUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            // Handle rate limiting (429) or server errors (5xx) with retry
            if (response.status === 429 || response.status >= 500) {
                if (i === MAX_RETRIES - 1) {
                    // Throw on last attempt to break the loop
                    throw new Error(`API failed after ${MAX_RETRIES} retries with status ${response.status}.`);
                }
                const delay = BASE_DELAY_MS * (2 ** i) + Math.random() * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
                continue; // Retry
            }

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`API request failed with status ${response.status}: ${errorBody}`);
            }

            return response.json();

        } catch (error) {
            if (i === MAX_RETRIES - 1) throw error;
            const delay = BASE_DELAY_MS * (2 ** i) + Math.random() * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}


/**
 * Generates an executive summary and insights based on dashboard metrics using the Gemini API.
 * @param {object} metrics The dashboard metrics object.
 * @returns {Promise<string>} The generated markdown text.
 */
export const generateDashboardInsights = async (metrics) => {
    // Create a copy of categoryShare before sorting to avoid mutating original data
    const topCategory = [...metrics.categoryShare].sort((a, b) => b.value - a.value)[0]?.name;

    const model = 'gemini-2.5-flash-preview-09-2025';
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

    // System instruction to define the model's persona and formatting rules
    const systemPrompt = "You are a senior tourism data analyst for the state of Jharkhand, India. Analyze the provided metrics and provide a concise, actionable executive summary (max 200 words) for tourism officials. Focus on visitor trends, high-performing destinations and categories, AI Assistant engagement usage, and recommendations. Format the output as clean Markdown with clear bullet points. Do not include introductory phrases like 'Based on the data...' or 'Here is the summary:'.";
    
    // User query containing the data to analyze
    const userQuery = `
        Analyze the tourism data based on the following metrics:
        - Total Visitors (Last 30 Days): ${metrics.totalVisitors}
        - "Get Directions" Clicks (Intent to visit): ${metrics.totalDirections}
        - AI Assistant Queries: ${metrics.totalAiQueries}
        - Average Visitor Rating: ${metrics.avgRating}/5
        - Top 3 Destinations: ${metrics.topDestinations.slice(0, 3).map(d => d.name).join(', ')}
        - Top Category: ${topCategory}
    `;

    const payload = {
        contents: [{ parts: [{ text: userQuery }] }],
        systemInstruction: {
            parts: [{ text: systemPrompt }]
        },
    };

    try {
        const result = await fetchWithExponentialBackoff(apiUrl, payload);
        const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
        return text || "Unable to generate insights at this time.";
    } catch (error) {
        console.error("AI Insight Error:", error);
        return "AI service currently unavailable. Failed to connect to the Gemini API.";
    }
};