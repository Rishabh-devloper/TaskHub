import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const testConnection = async () => {
  console.log('🧪 Testing MongoDB connection...');
  console.log('MongoDB URI:', process.env.MONGODB_URI.replace(/:[^:]*@/, ':****@')); // Hide password
  
  try {
    // Set shorter timeouts for testing
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 20000, // 20 seconds
    });
    
    console.log('✅ MongoDB Connection Test PASSED');
    console.log(`📍 Connected to: ${conn.connection.host}`);
    console.log(`🏷️  Database name: ${conn.connection.name}`);
    console.log(`🔗 Connection state: ${mongoose.connection.readyState}`);
    
    // Test a simple query
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`📚 Found ${collections.length} collections:`, collections.map(c => c.name));
    
    // Close connection
    await mongoose.connection.close();
    console.log('🔐 Connection closed successfully');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ MongoDB Connection Test FAILED');
    console.error('Error details:', error.message);
    
    if (error.name === 'MongooseServerSelectionError') {
      console.error('🔍 This usually means:');
      console.error('   1. MongoDB server is not running');
      console.error('   2. Network connectivity issues');
      console.error('   3. Incorrect connection string');
      console.error('   4. IP address not whitelisted (for MongoDB Atlas)');
    }
    
    process.exit(1);
  }
};

testConnection();
