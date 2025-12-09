const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const mongoURL = process.env.MONGO_URL;

console.log("Testing MongoDB Connection...");
console.log("URL:", mongoURL ? "Loaded" : "Missing");

async function testConnection() {
    try {
        await mongoose.connect(mongoURL, {
            serverSelectionTimeoutMS: 5000 // Fail fast
        });
        console.log("✅ Successfully connected to MongoDB!");

        const collection = mongoose.connection.collection('test_connection');
        await collection.insertOne({ test: true, time: new Date() });
        console.log("✅ Successfully inserted a test document.");

        const doc = await collection.findOne({ test: true });
        console.log("✅ Successfully read test document:", doc);

        await collection.deleteOne({ test: true });
        console.log("✅ Successfully cleaned up test document.");

        console.log("🎉 Database connection is HEALTHY.");
        process.exit(0);
    } catch (error) {
        console.error("❌ MongoDB Connection Failed:");
        console.error(error);
        process.exit(1);
    }
}

testConnection();
