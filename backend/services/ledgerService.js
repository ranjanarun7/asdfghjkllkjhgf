const axios = require('axios');

// Default to localhost for local development
// specific IP can be used if backend and ledger are on different machines
const LEDGER_API_MINE = 'http://localhost:3001/api/mine';
const LEDGER_API_CHAIN = 'http://localhost:3001/api/chain';

const checkConnection = async () => {
    try {
        await axios.get(LEDGER_API_CHAIN);
        console.log("✅ Connected to Blockchain Ledger");
        return true;
    } catch (err) {
        console.error("❌ Failed to connect to Blockchain Ledger");
        return false;
    }
};

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

module.exports = { recordTransaction, checkConnection };
