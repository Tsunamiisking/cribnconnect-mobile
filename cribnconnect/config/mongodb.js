const mongoose = require('mongoose');
const { MongoClient, ServerApiVersion } = require('mongodb');

// MongoDB Atlas connection string
const uri = "mongodb+srv://ttdotdev:5iUfMFmx4yJS0GjA@cribandconnect.jtdysfc.mongodb.net/?retryWrites=true&w=majority&appName=cribandconnect";

const mongoConfig = {
  connectionString: process.env.MONGODB_URI || uri,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    bufferMaxEntries: 0,
    bufferCommands: false,
    // MongoDB Stable API configuration
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  }
};

const connectMongoDB = async () => {
  try {
    // Test connection first with native MongoDB client
    const client = new MongoClient(mongoConfig.connectionString, {
      serverApi: mongoConfig.options.serverApi
    });
    
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Pinged MongoDB deployment successfully!");
    await client.close();
    
    // Now connect with Mongoose for schema management
    await mongoose.connect(mongoConfig.connectionString, mongoConfig.options);
    console.log('✅ Connected to MongoDB with Mongoose successfully');
    
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('🔌 MongoDB disconnected');
    });
    
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🛑 MongoDB connection closed through app termination');
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

const disconnectMongoDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('🔌 Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error disconnecting from MongoDB:', error);
  }
};

module.exports = {
  connectMongoDB,
  disconnectMongoDB,
  mongoose,
  MongoClient, // Export for direct MongoDB operations if needed
  uri // Export the connection string
};
