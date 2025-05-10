const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const path = require('path');

// Update this with your actual MongoDB connection string or use .env
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mud-formulator';

// Inline AvailableProduct model definition
const availableProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specificGravity: { type: Number, required: true },
  function: { type: String, required: true },
}, {
  timestamps: true
});
const AvailableProduct = mongoose.model('AvailableProduct', availableProductSchema);

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const results = [];

const csvFilePath = path.join(__dirname, 'products.csv'); // Place your CSV in backend/scripts/products.csv

// Helper to normalize headers (remove BOM, invisible chars, trim)
const normalizeHeader = (header) => (header || '').replace(/[\u200B-\u200D\uFEFF]/g, '').trim();

let headerKeys = null;
let skippedCount = 0;
const maxSkippedToLog = 10;

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (data) => {
    
    if (!headerKeys) {
      headerKeys = Object.keys(data);
      console.log('Detected CSV headers:', headerKeys.map(normalizeHeader));
    }
    if (!data['Product'] && !data['Specific Gravity'] && !data['Purpose']) {
      return;
    }
    const name = data[headerKeys[0]];
    const sgRaw = data[normalizeHeader('Specific Gravity')] && data[normalizeHeader('Specific Gravity')].replace(',', '.').trim();
    const specificGravity = parseFloat(sgRaw);
    const func = data[normalizeHeader('Purpose')] && data[normalizeHeader('Purpose')].trim();
    console.log(name, specificGravity, func);
    // Insert all rows, regardless of validity
    results.push({
      name,
      specificGravity,
      function: func,
    });
  })
  .on('end', async () => {
    try {
      await AvailableProduct.insertMany(results);
      console.log('Products inserted!');
      process.exit();
    } catch (err) {
      console.error('Error inserting products:', err);
      process.exit(1);
    }
  }); 