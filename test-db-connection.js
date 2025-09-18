const mongoose = require('mongoose');

// Use the same connection string from the .env file
const MONGODB_URI = 'mongodb+srv://temchelsy_db_user:m9qA8AbC84g2H1kN@cluster0.ftf7myp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...');
    console.log('📍 Connecting to:', MONGODB_URI.replace(/\/\/.*@/, '//****@'));
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Successfully connected to MongoDB Atlas!');
    
    // Get database info
    const db = mongoose.connection.db;
    const admin = db.admin();
    const dbInfo = await admin.serverStatus();
    
    console.log('📊 Database Info:');
    console.log('   - Database Name:', db.databaseName);
    console.log('   - Host:', dbInfo.host);
    console.log('   - Version:', dbInfo.version);
    console.log('   - Uptime:', Math.floor(dbInfo.uptime / 3600), 'hours');
    
    // List collections
    const collections = await db.listCollections().toArray();
    console.log('📁 Collections:');
    if (collections.length === 0) {
      console.log('   - No collections found (empty database)');
    } else {
      collections.forEach(col => {
        console.log(`   - ${col.name}`);
      });
    }
    
    // Test Canvas collection specifically
    const canvasCollection = db.collection('canvases');
    const canvasCount = await canvasCollection.countDocuments();
    console.log(`🎨 Canvas documents: ${canvasCount}`);
    
    if (canvasCount > 0) {
      const sampleCanvas = await canvasCollection.findOne({});
      console.log('📝 Sample canvas:', JSON.stringify(sampleCanvas, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error('   Error:', error.message);
    
    if (error.message.includes('authentication failed')) {
      console.log('🔐 Authentication issue - check username/password');
    } else if (error.message.includes('network')) {
      console.log('🌐 Network issue - check internet connection');
    }
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from database');
  }
}

testConnection();
