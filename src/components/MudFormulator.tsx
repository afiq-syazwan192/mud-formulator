import React, { useState } from 'react';
import {
  Box,
  Select,
  MenuItem,
  TextField,
  Button,
  Paper,
  Grid,
  Typography
} from '@mui/material';
import { MudFormulation, Product } from '../types/types';
import { ProductTable } from './ProductTable';
import { calculateMudFormulation } from '../utils/calculations';
import AddIcon from '@mui/icons-material/Add';
import { AddProductModal } from './AddProductModal';

interface CalculationResult {
    totalVolume: number;
    productAmounts: {
        name: string;
        amount: number;
        unit: string;
    }[];
}

const initialState: MudFormulation = {
    mudType: 'Water-Based Mud',
    weighted: 'Weighted',
    mudWeight: 10.00,
    desiredOil: 0,
    baseOil: {
        type: 'Canola Oil',
        ratio: 100,
        specificGravity: 0.930
    },
    salinity: 8,
    saltPurity: 95,
    weightMaterial: {
        type: 'MIL-BAR',
        specificGravity: 4.20
    },
    products: [
        { name: 'CAUSTIC SODA', concentration: 0.5, specificGravity: 2.130, additionMethod: 'lb/bbl' },
        { name: 'SODA ASH', concentration: 0.5, specificGravity: 2.509, additionMethod: 'lb/bbl' },
        { name: 'MIL-PAC LV', concentration: 3, specificGravity: 1.600, additionMethod: 'lb/bbl' },
        { name: 'XANPLEX D', concentration: 2, specificGravity: 1.500, additionMethod: 'lb/bbl' },
        { name: 'SOLTEX', concentration: 1, specificGravity: 0.980, additionMethod: 'lb/bbl' },
        { name: 'NEW DRILL PLUS', concentration: 0.25, specificGravity: 0.850, additionMethod: 'lb/bbl' },
        { name: 'Lube S', concentration: 0, specificGravity: 0.910, additionMethod: '% by volume' }
    ]
};

export const MudFormulator: React.FC = () => {
  const [formulation, setFormulation] = useState<MudFormulation>(initialState);
  const [calculationResults, setCalculationResults] = useState<any>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleProductChange = (index: number, updatedProduct: Product) => {
    const newProducts = [...formulation.products];
    newProducts[index] = updatedProduct;
    setFormulation({ ...formulation, products: newProducts });
  };

  const handleCalculate = () => {
    const results = calculateMudFormulation(
      formulation.mudWeight,
      formulation.products
    );
    setCalculationResults(results);
  };

  const handleReset = () => {
    setFormulation(initialState);
    setCalculationResults(null);
  };

  const handleResetValues = () => {
    setFormulation({
      ...formulation,
      products: formulation.products.map(p => ({ ...p, concentration: 0 }))
    });
    setCalculationResults(null);
  };

  const handleAddProduct = (newProduct: Product) => {
    setFormulation(prev => ({
      ...prev,
      products: [...prev.products, newProduct]
    }));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Select Mud type</Typography>
                <Select
                  fullWidth
                  value={formulation.mudType}
                  onChange={(e) => setFormulation({ ...formulation, mudType: e.target.value })}
                >
                  <MenuItem value="Water-Based Mud">Water-Based Mud</MenuItem>
                  <MenuItem value="Oil-Based Mud">Oil-Based Mud</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">Mud weight (ppg)</Typography>
                <TextField
                  fullWidth
                  type="number"
                  value={formulation.mudWeight}
                  onChange={(e) => setFormulation({
                    ...formulation,
                    mudWeight: parseFloat(e.target.value) || 0
                  })}
                  inputProps={{ step: 0.1 }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <ProductTable
            products={formulation.products}
            onProductChange={handleProductChange}
          />
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              startIcon={<AddIcon />}
              onClick={() => setIsAddModalOpen(true)}
              variant="contained"
              color="primary"
            >
              Add Product
            </Button>
          </Box>
        </Grid>

        {calculationResults && (
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Calculation Results</Typography>
              <Typography>Total Volume: {calculationResults.totalVolume} bbl</Typography>
              <Typography variant="subtitle1" sx={{ mt: 2 }}>Product Amounts:</Typography>
              {calculationResults.productAmounts.map((result: any, index: number) => (
                <Typography key={index}>
                  {result.name}: {result.amount} {result.unit}
                </Typography>
              ))}
            </Paper>
          </Grid>
        )}

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" onClick={handleCalculate}>Calculate</Button>
            <Button variant="contained" onClick={handleReset}>Reset All</Button>
            <Button variant="contained" onClick={handleResetValues}>Reset Values</Button>
          </Box>
        </Grid>

        <AddProductModal
          open={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddProduct}
        />
      </Grid>
    </Box>
  );
}; 