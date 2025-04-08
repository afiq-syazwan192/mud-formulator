const mongoose = require('mongoose');
require('dotenv').config();

async function checkDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB successfully!');

    // Get all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\nCollections in database:');
    collections.forEach(collection => console.log(`- ${collection.name}`));

    // Check each collection
    for (const collection of collections) {
      const documents = await mongoose.connection.db.collection(collection.name).find({}).toArray();
      console.log(`\nDocuments in ${collection.name}:`);
      console.log(JSON.stringify(documents, null, 2));
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkDatabase(); 