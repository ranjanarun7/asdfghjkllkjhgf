const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto');
const os = require('os');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// --- BLOCKCHAIN LOGIC ---

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return crypto
            .createHash('sha256')
            .update(
                this.index +
                this.previousHash +
                this.timestamp +
                JSON.stringify(this.data) +
                this.nonce
            )
            .digest('hex');
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock() {
        return new Block(0, "2024-01-01T00:00:00.000Z", { info: "Genesis Block" }, "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        // In a real blockchain, we would have proof of work here.
        // For this local ledger, we just add it.
        this.chain.push(newBlock);
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}

const localChain = new Blockchain();

// --- API ENDPOINTS ---

// 1. Get Chain Data
app.get('/api/chain', (req, res) => {
    res.json({
        isValid: localChain.isChainValid(),
        length: localChain.chain.length,
        chain: localChain.chain
    });
});

// 2. Mine New Block (Record Data)
app.post('/api/mine', (req, res) => {
    const data = req.body;

    if (!data || Object.keys(data).length === 0) {
        return res.status(400).json("No data provided");
    }

    const latestBlock = localChain.getLatestBlock();
    const newBlock = new Block(
        latestBlock.index + 1,
        new Date().toISOString(),
        data
    );

    localChain.addBlock(newBlock);

    console.log(`⛏️  Block Mined: Index ${newBlock.index}`);

    res.json({
        message: "Block added successfully",
        block: {
            index: newBlock.index,
            hash: newBlock.hash,
            timestamp: newBlock.timestamp,
            data: newBlock.data
        }
    });
});

// Helper to get local IP
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return '127.0.0.1';
}

// Start Server
app.listen(PORT, () => {
    const ip = getLocalIP();
    console.log(`\nLocal Chain Ledger Running!`);
    console.log(`- Local:   http://localhost:${PORT}/api/chain`);
    console.log(`- Network: http://${ip}:${PORT}/api/chain`);
    console.log(`\nReady to mine transactions...\n`);
});
