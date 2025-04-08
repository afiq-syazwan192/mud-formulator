import React, { useState } from 'react';
import { TextField, Button, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

interface AddAvailableProductFormProps {
    onAdd: (product: { name: string; specificGravity: number; function: string }) => void;
}

const PRODUCT_FUNCTIONS = [
    'Base Oils',
    'Biocide',
    'Corrosion Inhibitor',
    'Deflocculant',
    'Defoamer',
    'Drill-in Additives',
    'Emulsifier',
    'Hydrated Inhibitor',
    'LCM',
    'Lubricant',
    'Other',
    'pH Control',
    'Rheology Filtration',
    'ROP',
    'Salts',
    'Shale Control',
    'Weight Materials'
];

const AddAvailableProductForm: React.FC<AddAvailableProductFormProps> = ({ onAdd }) => {
    const [productName, setProductName] = useState('');
    const [specificGravity, setSpecificGravity] = useState('');
    const [productFunction, setProductFunction] = useState('');

    const handleAddProduct = () => {
        if (productName && specificGravity && productFunction) {
            onAdd({
                name: productName,
                specificGravity: parseFloat(specificGravity),
                function: productFunction
            });
            setProductName('');
            setSpecificGravity('');
            setProductFunction('');
        }
    };

    return (
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
                label="Product Name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                fullWidth
            />
            <TextField
                label="Specific Gravity"
                type="number"
                value={specificGravity}
                onChange={(e) => setSpecificGravity(e.target.value)}
                inputProps={{ step: '0.001' }}
                fullWidth
            />
            <FormControl fullWidth>
                <InputLabel>Function</InputLabel>
                <Select
                    value={productFunction}
                    onChange={(e) => setProductFunction(e.target.value)}
                    label="Function"
                >
                    {PRODUCT_FUNCTIONS.map((func) => (
                        <MenuItem key={func} value={func}>
                            {func}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                    variant="contained"
                    onClick={handleAddProduct}
                    disabled={!productName || !specificGravity || !productFunction}
                >
                    Add Available Product
                </Button>
            </Box>
        </Box>
    );
};

export default AddAvailableProductForm; 