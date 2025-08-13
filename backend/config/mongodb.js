const mongoose = require('mongoose');

const mongoConfig = {
  connectionString: process.env.MONGODB_URI || "mongodb+srv://ttdotdev:5iUfMFmx4yJS0GjA@cribandconnect.jtdysfc.mongodb.net/?retryWrites=true&w=majority&appName=cribandconnect",
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    bufferMaxEntries: 0,
    bufferCommands: false,
  }
};

const connectMongoDB = async () => {
  try {
    await mongoose.connect(mongoConfig.connectionString, mongoConfig.options);
    console.log('✅ Connected to MongoDB successfully');
    
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
  mongoose
};
