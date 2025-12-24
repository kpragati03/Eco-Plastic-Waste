const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Create indexes for better performance
    await createIndexes();
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

const createIndexes = async () => {
  try {
    const db = mongoose.connection.db;
    
    // User indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ role: 1 });
    
    // Campaign indexes
    await db.collection('campaigns').createIndex({ status: 1 });
    await db.collection('campaigns').createIndex({ category: 1 });
    await db.collection('campaigns').createIndex({ createdAt: -1 });
    
    // Resource indexes
    await db.collection('resources').createIndex({ category: 1 });
    await db.collection('resources').createIndex({ status: 1 });
    
    // Agency indexes
    await db.collection('agencies').createIndex({ location: '2dsphere' });
    await db.collection('agencies').createIndex({ status: 1 });
    
    console.log('Database indexes created successfully');
  } catch (error) {
    console.error('Error creating indexes:', error.message);
  }
};

module.exports = connectDB;