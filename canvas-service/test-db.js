const mongoose = require('mongoose');
require('dotenv').config();

async function testDatabaseConnection() {
  try {
    console.log('Testing database connection...');
    console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Set (hiding credentials)' : 'Not set');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Successfully connected to MongoDB');
    
    // Get database name
    const dbName = mongoose.connection.db.databaseName;
    console.log('📊 Connected to database:', dbName);
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📁 Available collections:');
    collections.forEach(collection => {
      console.log(`  - ${collection.name}`);
    });
    
    // Check if canvas collection exists and has data
    const canvasCollection = mongoose.connection.db.collection('canvases');
    const canvasCount = await canvasCollection.countDocuments();
    console.log(`📄 Canvas documents count: ${canvasCount}`);
    
    if (canvasCount > 0) {
      console.log('📋 Sample canvas documents:');
      const samples = await canvasCollection.find({}).limit(3).toArray();
      samples.forEach((doc, index) => {
        console.log(`  ${index + 1}. ID: ${doc._id}, Title: ${doc.title || 'Untitled'}, Shapes: ${doc.shapes?.length || 0}`);
      });
    }
    
    console.log('✅ Database test completed successfully');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

testDatabaseConnection();
