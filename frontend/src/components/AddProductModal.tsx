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

interface AddProductModalProps {
    open: boolean;
    onClose: () => void;
    onAdd: (product: Product) => void;
    availableProducts: { name: string; specificGravity: number }[];
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
    onAdd,
    availableProducts
}) => {
    const [selectedProduct, setSelectedProduct] = useState('');

    const handleAdd = () => {
        const productDetails = availableProducts.find(p => p.name === selectedProduct);
        if (productDetails) {
            const newProduct = {
                name: productDetails.name,
                concentration: 0,
                specificGravity: productDetails.specificGravity,
                additionMethod: 'lb/bbl'
            };
            onAdd(newProduct);
            setSelectedProduct('');
            onClose();
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle}>
                <Typography variant="h6" mb={2}>Add New Product</Typography>
                <FormControl fullWidth>
                    <InputLabel>Select Product</InputLabel>
                    <Select
                        value={selectedProduct}
                        onChange={e => setSelectedProduct(e.target.value as string)}
                        label="Select Product"
                    >
                        {availableProducts.map(product => (
                            <MenuItem key={product.name} value={product.name}>
                                {product.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Box mt={2} display="flex" justifyContent="flex-end">
                    <Button variant="contained" onClick={handleAdd} disabled={!selectedProduct}>
                        Add
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}; 