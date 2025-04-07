import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

interface AddAvailableProductFormProps {
    onAdd: (product: { name: string; details: string }) => void;
}

const AddAvailableProductForm: React.FC<AddAvailableProductFormProps> = ({ onAdd }) => {
    const [productName, setProductName] = useState('');
    const [productDetails, setProductDetails] = useState('');

    const handleAddProduct = () => {
        if (productName && productDetails) {
            onAdd({ name: productName, details: productDetails });
            setProductName('');
            setProductDetails('');
        }
    };

    return (
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
                label="Product Name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                fullWidth
            />
            <TextField
                label="Product Details"
                value={productDetails}
                onChange={(e) => setProductDetails(e.target.value)}
                fullWidth
            />
            <Button variant="contained" onClick={handleAddProduct}>
                Add Available Product
            </Button>
        </Box>
    );
};

export default AddAvailableProductForm; 