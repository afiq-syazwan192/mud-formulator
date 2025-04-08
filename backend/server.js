const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

let products = [];
let availableProducts = [];

// Constants
const DEFAULT_SALINITY = 10;
const DEFAULT_SALT_PURITY = 95;

// Routes
app.post('/api/products', (req, res) => {
    const product = {
        ...req.body,
        salinity: req.body.salinity || DEFAULT_SALINITY,
        saltPurity: req.body.saltPurity || DEFAULT_SALT_PURITY
    };
    products.push(product);
    res.status(201).json({ message: 'Product added successfully', product });
});

app.put('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const updatedProduct = req.body;

    if (id >= 0 && id < products.length) {
        products[id] = { ...products[id], ...updatedProduct };
        res.json({ message: 'Product updated successfully', product: products[id] });
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

app.get('/api/products', (req, res) => {
    res.json(products);
});

// Add an available product
app.post('/api/available-products', (req, res) => {
    const product = req.body;
    availableProducts.push(product);
    res.status(201).json({ message: 'Available product added successfully', product });
});

// Get all available products
app.get('/api/available-products', (req, res) => {
    res.json(availableProducts);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});