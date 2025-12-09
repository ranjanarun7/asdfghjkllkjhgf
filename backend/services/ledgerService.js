const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// Load Artifact
const artifactPath = path.join(__dirname, "../artifacts/TourismChain.json");
let CONTRACT_ABI = [];
try {
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
    CONTRACT_ABI = artifact.abi;
} catch (e) {
    console.error("❌ Failed to load contract artifact:", e.message);
}

// Configuration
const RPC_URL = process.env.RPC_URL || "https://rpc-amoy.polygon.technology/";
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS =
    process.env.CONTRACT_ADDRESS || "0x8ffD6d43c243913CB82046e1589C6Aea6FDef06B";

// Initialize Provider & Wallet
let provider, wallet, contract;

const initializeBlockchain = () => {
    try {
        if (!PRIVATE_KEY) {
            console.warn("⚠️ Blockchain Warning: PRIVATE_KEY not found in .env");
            return;
        }
        provider = new ethers.JsonRpcProvider(RPC_URL);
        wallet = new ethers.Wallet(PRIVATE_KEY, provider);
        contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);
        console.log("✅ Blockchain Service Initialized");
        console.log(`   - Wallet: ${wallet.address}`);
        console.log(`   - Contract: ${CONTRACT_ADDRESS}`);
    } catch (err) {
        console.error("❌ Blockchain Init Failed:", err.message);
    }
};

// Initialize immediately
initializeBlockchain();

const checkConnection = async () => {
    try {
        if (!provider) return false;
        const network = await provider.getNetwork();
        console.log(`✅ Connected to Network: ${network.name} (Chain ID: ${network.chainId})`);
        return true;
    } catch (err) {
        console.error("❌ Blockchain Connection Check Failed:", err.message);
        return false;
    }
};

const recordTransaction = async (data) => {
    if (!contract) {
        console.error("❌ Blockchain contract not initialized. Cannot record transaction.");
        return null;
    }

    try {
        let tx;
        // Manual gas limit for safety on testnet
        const options = { gasLimit: 500000 };

        if (data.type === "PAYMENT") {
            console.log(`[Ledger] Processing Booking Payment: ${data.orderId}`);
            // createBooking(string _orderId, uint256 _userId, uint256 _guideId, uint256 _amount, string _currency, string _paymentRef)
            tx = await contract.createBooking(
                data.orderId,
                "0x" + data.userId, // Ensure 0x prefix for BigInt
                data.guideId || 0,
                data.amount,
                data.currency || "INR",
                data.paymentRef || "N/A",
                options
            );
        } else if (data.type === "GUIDE_VERIFY") {
            console.log(`[Ledger] Verifying Guide: ${data.guideId}`);
            // verifyGuide(uint256 _guideId, bool _status, string _uri)
            tx = await contract.verifyGuide(
                data.guideId,
                true,
                data.metadataURI || "Verified Guide",
                options
            );
        } else if (data.type === "GUIDE_UNVERIFY") {
            console.log(`[Ledger] Unverifying Guide: ${data.guideId}`);
            tx = await contract.verifyGuide(
                data.guideId,
                false,
                data.metadataURI || "Unverified",
                options
            );
        } else {
            console.warn(`[Ledger] Unknown transaction type: ${data.type}`);
            return null;
        }

        console.log(`⏳ [Ledger] Tx Sent: ${tx.hash}. Waiting for confirmation...`);
        const receipt = await tx.wait();
        console.log(`✅ [Ledger] Tx Confirmed: ${receipt.hash}`);

        return {
            success: true,
            txHash: receipt.hash,
            blockNumber: receipt.blockNumber
        };

    } catch (err) {
        console.error("❌ [Ledger] Transaction Failed:", err.reason || err.message);
        return null;
    }
};

module.exports = { recordTransaction, checkConnection };
