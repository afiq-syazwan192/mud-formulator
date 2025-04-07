import React, { useState } from 'react';
import {
  Box,
  Select,
  MenuItem,
  TextField,
  Button,
  Paper,
  Grid,
  Typography,
  styled
} from '@mui/material';
import { MudFormulation, Product, CalculationResult } from '../types/types';
import { ProductTable } from './ProductTable';
import { calculateMudFormulation } from '../utils/calculations';
import AddIcon from '@mui/icons-material/Add';
import { AddProductModal } from './AddProductModal';
import { ConfirmDialog } from './ConfirmDialog';
import { AdditionalForms } from './AdditionalForms';
import { AVAILABLE_PRODUCTS } from '../constants/products';
import { BASE_OILS } from '../constants/baseOils';
import AddAvailableProductForm from './AddAvailableProductForm';
import axios from 'axios';

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
    waterAndSalt: [
        {
            type: 'KCl',
            salinity: 8,
            saltPurity: 95,
            wtPercent: 'Wt% Salt'
        },
        {
            type: 'Water',
            salinity: 0,
            saltPurity: 0,
            wtPercent: 'Wt% Salt'
        }
    ],
    weightMaterial: {
        type: 'MIL-BAR',
        specificGravity: 4.20
    },
    products: []
};

export const MudFormulator: React.FC = () => {
  const [formulation, setFormulation] = useState<MudFormulation>(initialState);
  const [calculationResults, setCalculationResults] = useState<CalculationResult | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [productToRemove, setProductToRemove] = useState<number | null>(null);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleProductChange = (index: number, updatedProduct: Product) => {
    const newProducts = [...formulation.products];
    newProducts[index] = updatedProduct;
    setFormulation({ ...formulation, products: newProducts });
  };

  const validateInputs = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (formulation.mudWeight <= 0) {
        newErrors.mudWeight = 'Mud weight must be greater than 0';
    }
    if (formulation.desiredOil < 0 || formulation.desiredOil > 100) {
        newErrors.desiredOil = 'Desired oil must be between 0 and 100%';
    }
    if (formulation.baseOil.ratio < 0 || formulation.baseOil.ratio > 100) {
        newErrors.baseOilRatio = 'Base oil ratio must be between 0 and 100%';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validateInputs()) {
        return;
    }
    
    try {
        const results = calculateMudFormulation(
            formulation.mudWeight,
            formulation.products,
            formulation.baseOil,
            formulation.waterAndSalt,
            formulation.weightMaterial
        );
        
        setCalculationResults(results);
    } catch (error) {
        console.error('Calculation error:', error);
        setErrors({ calculation: 'Error performing calculations' });
    }
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

  const handleProductRemove = (index: number) => {
    setFormulation(prev => ({
        ...prev,
        products: prev.products.filter((_, i) => i !== index)
    }));
  };

  const handleConfirmRemove = () => {
    if (productToRemove !== null) {
      setFormulation(prev => ({
        ...prev,
        products: prev.products.filter((_, i) => i !== productToRemove)
      }));
      setCalculationResults(null);
    }
    setConfirmDialogOpen(false);
    setProductToRemove(null);
  };

  const handleAddAvailableProduct = async (product: { name: string; details: string }) => {
    try {
      await axios.post('/api/available-products', product);
      console.log('Available product added successfully');
    } catch (error) {
      console.error('Error adding available product:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Mud Type Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography>Select Mud type</Typography>
                <Select
                  fullWidth
                  value={formulation.mudType}
                  onChange={(e) => setFormulation({
                    ...formulation,
                    mudType: e.target.value
                  })}
                >
                  <MenuItem value="Water-Based Mud">Water-Based Mud</MenuItem>
                  <MenuItem value="Oil-Based Mud">Oil-Based Mud</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={12}>
                <Typography>Weighted</Typography>
                <Select
                  fullWidth
                  value={formulation.weighted}
                  onChange={(e) => setFormulation({
                    ...formulation,
                    weighted: e.target.value
                  })}
                >
                  <MenuItem value="Weighted">Weighted</MenuItem>
                  <MenuItem value="Unweighted">Unweighted</MenuItem>
                </Select>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Mud Weight and Oil Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography>Mud weight</Typography>
                <TextField
                  fullWidth
                  type="number"
                  value={formulation.mudWeight || ""}
                  onChange={(e) => setFormulation({
                    ...formulation,
                    mudWeight: e.target.value === "" ? 0 : parseFloat(e.target.value)
                  })}
                  error={!!errors.mudWeight}
                  helperText={errors.mudWeight}
                  inputProps={{ step: 0.1 }}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography>Desired % Oil</Typography>
                <TextField
                  type="number"
                  value={formulation.desiredOil || ""}
                  onChange={(e) => setFormulation({
                    ...formulation,
                    desiredOil: e.target.value === "" ? 0 : parseFloat(e.target.value)
                  })}
                  error={!!errors.desiredOil}
                  helperText={errors.desiredOil}
                  inputProps={{ min: 0, max: 100, step: 1 }}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Base Oil Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1">Base Oil</Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Select
                  fullWidth
                  value={formulation.baseOil.type}
                  onChange={(e) => {
                    const selectedOil = BASE_OILS.find(oil => oil.type === e.target.value);
                    if (selectedOil) {
                        setFormulation({
                            ...formulation,
                            baseOil: {
                                ...formulation.baseOil,
                                type: selectedOil.type,
                                specificGravity: selectedOil.specificGravity
                            }
                        });
                    }
                  }}
                >
                  {BASE_OILS.map((oil) => (
                    <MenuItem key={oil.type} value={oil.type}>
                      {oil.type}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Ratio %"
                  type="number"
                  value={formulation.baseOil.ratio || ""}
                  onChange={(e) => setFormulation({
                    ...formulation,
                    baseOil: {
                      ...formulation.baseOil,
                      ratio: e.target.value === "" ? 0 : parseFloat(e.target.value)
                    }
                  })}
                  error={!!errors.baseOilRatio}
                  helperText={errors.baseOilRatio}
                  inputProps={{ min: 0, max: 100, step: 1 }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="S.G."
                  value={formulation.baseOil.specificGravity}
                  disabled
                  fullWidth
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Water and Salt Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1">Add Water and Salt</Typography>
            {formulation.waterAndSalt.map((item, index) => (
              <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                <Grid item xs={3}>
                  <Select
                    fullWidth
                    value={item.type}
                    onChange={(e) => {
                      const newWaterAndSalt = [...formulation.waterAndSalt];
                      newWaterAndSalt[index] = {
                        ...item,
                        type: e.target.value
                      };
                      setFormulation({
                        ...formulation,
                        waterAndSalt: newWaterAndSalt
                      });
                    }}
                  >
                    <MenuItem value="KCl">KCl</MenuItem>
                    <MenuItem value="Water">Water</MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    label="Salinity"
                    type="number"
                    value={item.salinity || ""}
                    onChange={(e) => {
                      const newWaterAndSalt = [...formulation.waterAndSalt];
                      newWaterAndSalt[index] = {
                        ...item,
                        salinity: e.target.value === "" ? 0 : parseFloat(e.target.value)
                      };
                      setFormulation({
                        ...formulation,
                        waterAndSalt: newWaterAndSalt
                      });
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    label="Salt Purity"
                    type="number"
                    value={item.saltPurity || ""}
                    onChange={(e) => {
                      const newWaterAndSalt = [...formulation.waterAndSalt];
                      newWaterAndSalt[index] = {
                        ...item,
                        saltPurity: e.target.value === "" ? 0 : parseFloat(e.target.value)
                      };
                      setFormulation({
                        ...formulation,
                        waterAndSalt: newWaterAndSalt
                      });
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    label="Wt% Salt"
                    value={item.wtPercent}
                    disabled
                    fullWidth
                  />
                </Grid>
              </Grid>
            ))}
          </Paper>
        </Grid>

        {/* Weighting Material Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1">Weight Material</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Select
                  fullWidth
                  value={formulation.weightMaterial.type}
                  onChange={(e) => setFormulation({
                    ...formulation,
                    weightMaterial: {
                      ...formulation.weightMaterial,
                      type: e.target.value
                    }
                  })}
                >
                  <MenuItem value="MIL-BAR">MIL-BAR</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  type="number"
                  value={formulation.weightMaterial.specificGravity}
                  disabled
                  fullWidth
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Display Calculation Results */}
        {calculationResults && (
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Calculation Results</Typography>
              <Typography>Total Volume: {calculationResults.totalVolume.toFixed(2)} bbl</Typography>
              <Typography>Total Weight: {calculationResults.totalWeight.toFixed(2)} lb</Typography>
              <Typography>Final Mud Weight: {calculationResults.finalMudWeight.toFixed(2)} ppg</Typography>
              <Typography variant="subtitle1" sx={{ mt: 2 }}>Product Amounts:</Typography>
              {calculationResults.productAmounts.map((result, index) => (
                <Typography key={index}>
                  {result.name}: {result.amount.toFixed(2)} {result.unit} 
                  ({result.volume.toFixed(4)} bbl)
                </Typography>
              ))}
            </Paper>
          </Grid>
        )}

        {/* Products Section */}
        <Grid item xs={12}>
          <ProductTable
            products={formulation.products}
            onProductChange={handleProductChange}
            onProductRemove={handleProductRemove}
          />
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, mt: 2, mx: 2 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button variant="contained" onClick={handleCalculate}>
                        Calculate
                    </Button>
                    <Button variant="contained" onClick={() => setFormulation(initialState)}>
                        Reset All
                    </Button>
                </Box>
                <Button
                    variant="contained"
                    onClick={() => setIsAddModalOpen(true)}
                    startIcon={<AddIcon />}
                >
                    Add Product
                </Button>
            </Box>
          </Grid>
        </Grid>
      </Grid>

      <AddProductModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddProduct}
      />

      <AddAvailableProductForm onAdd={handleAddAvailableProduct} />
    </Box>
  );
}; 