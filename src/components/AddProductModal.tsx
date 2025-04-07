import React, { useState } from 'react';
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';
import { Product } from '../types/types';

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

export const AddProductModal: React.FC<AddProductModalProps> = ({ open, onClose, onAdd }) => {
    const [newProduct, setNewProduct] = useState<Product>({
        name: '',
        concentration: 0,
        specificGravity: 0,
        additionMethod: 'lb/bbl'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd(newProduct);
        onClose();
        // Reset form
        setNewProduct({
            name: '',
            concentration: 0,
            specificGravity: 0,
            additionMethod: 'lb/bbl'
        });
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle} component="form" onSubmit={handleSubmit}>
                <Typography variant="h6" component="h2" mb={2}>
                    Add New Product
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        label="Product Name"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        required
                        fullWidth
                    />
                    <TextField
                        label="Specific Gravity"
                        type="number"
                        value={newProduct.specificGravity || ''}
                        onChange={(e) => setNewProduct({ 
                            ...newProduct, 
                            specificGravity: parseFloat(e.target.value) || 0 
                        })}
                        required
                        fullWidth
                        inputProps={{ step: 0.001 }}
                    />
                    <FormControl fullWidth>
                        <InputLabel>Addition Method</InputLabel>
                        <Select
                            value={newProduct.additionMethod}
                            onChange={(e) => setNewProduct({ 
                                ...newProduct, 
                                additionMethod: e.target.value 
                            })}
                            label="Addition Method"
                            required
                        >
                            <MenuItem value="lb/bbl">lb/bbl</MenuItem>
                            <MenuItem value="% by volume">% by volume</MenuItem>
                        </Select>
                    </FormControl>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button type="submit" variant="contained">Add Product</Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
}; 