const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

let products = [];

// Routes
app.post('/api/products', (req, res) => {
    const product = req.body;
    products.push(product);
    res.status(201).json({ message: 'Product added successfully', product });
});

app.get('/api/products', (req, res) => {
    res.json(products);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});