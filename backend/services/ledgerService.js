const axios = require('axios');

// Default to localhost for local development
// specific IP can be used if backend and ledger are on different machines
const LEDGER_API_MINE = 'http://localhost:5173/api/mine';

const recordTransaction = async (data) => {
    try {
        const response = await axios.post(LEDGER_API_MINE, {
            timestamp: new Date().toISOString(),
            ...data
        });
        console.log(`✅ [Ledger] Block Mined: Index ${response.data.block.index}`);
        return response.data;
    } catch (err) {
        // Graceful failure - don't crash the main app if ledger is down
        console.error("❌ [Ledger] Connection Failed:", err.message);
        return null;
    }
};

module.exports = { recordTransaction };
