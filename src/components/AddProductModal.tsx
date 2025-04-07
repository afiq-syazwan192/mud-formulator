import React, { useState } from 'react';
import {
    Modal,
    Box,
    Typography,
    Select,
    MenuItem,
    Button,
    FormControl,
    InputLabel
} from '@mui/material';
import { Product } from '../types/types';
import { AVAILABLE_PRODUCTS } from '../constants/products';

interface AddProductModalProps {
    open: boolean;
    onClose: () => void;
    onAdd: (product: Product) => void;
}

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 1,
};

export const AddProductModal: React.FC<AddProductModalProps> = ({
    open,
    onClose,
    onAdd
}) => {
    const [selectedProduct, setSelectedProduct] = useState('');

    const handleAdd = async () => {
        const productDetails = AVAILABLE_PRODUCTS.find(p => p.name === selectedProduct);
        if (productDetails) {
            const newProduct = {
                name: productDetails.name,
                concentration: 0,
                specificGravity: productDetails.defaultSG,
                additionMethod: productDetails.defaultMethod
            };
            
            // Save to database
            try {
                await fetch('http://localhost:5000/api/products', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newProduct)
                });
                onAdd(newProduct);
                setSelectedProduct('');
                onClose();
            } catch (error) {
                console.error('Error saving product:', error);
            }
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle}>
                <Typography variant="h6" component="h2" mb={2}>
                    Add New Product
                </Typography>
                <FormControl fullWidth>
                    <InputLabel>Select Product</InputLabel>
                    <Select
                        value={selectedProduct}
                        onChange={(e) => setSelectedProduct(e.target.value)}
                        label="Select Product"
                    >
                        {AVAILABLE_PRODUCTS.map((product) => (
                            <MenuItem key={product.name} value={product.name}>
                                {product.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button 
                        variant="contained" 
                        onClick={handleAdd}
                        disabled={!selectedProduct}
                    >
                        Add
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}; 