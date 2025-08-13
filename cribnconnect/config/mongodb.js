// MongoDB Configuration for Backend API
// This will be used in your backend/web platform

const mongoose = require('mongoose');

// MongoDB Configuration
const mongoConfig = {
  // TODO: Replace with your MongoDB connection string
  connectionString: process.env.MONGODB_URI || "mongodb://localhost:27017/cribnconnect",
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    bufferMaxEntries: 0, // Disable mongoose buffering
    bufferCommands: false, // Disable mongoose buffering
  }
};

// Connection function
const connectMongoDB = async () => {
  try {
    await mongoose.connect(mongoConfig.connectionString, mongoConfig.options);
    console.log('✅ Connected to MongoDB successfully');
    
    // Connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('🔌 MongoDB disconnected');
    });
    
    // Handle app termination
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

// Disconnect function
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
  mongoose
};
