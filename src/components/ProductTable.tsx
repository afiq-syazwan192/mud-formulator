import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  IconButton,
  Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Product } from '../types/types';
import { AVAILABLE_PRODUCTS } from '../constants/products';

interface ProductTableProps {
  products: Product[];
  onProductChange: (index: number, updatedProduct: Product) => void;
  onProductRemove: (index: number) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({ products, onProductChange, onProductRemove }) => {
  const handleProductNameChange = (index: number, productName: string) => {
    const selectedProduct = AVAILABLE_PRODUCTS.find(p => p.name === productName);
    if (selectedProduct) {
      onProductChange(index, {
        ...products[index],
        name: productName,
        specificGravity: selectedProduct.defaultSG,
        additionMethod: selectedProduct.defaultMethod
      });
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Select Products to Add</TableCell>
            <TableCell>Concentration</TableCell>
            <TableCell>S.G.</TableCell>
            <TableCell>Select addition method</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product, index) => (
            <TableRow key={index}>
              <TableCell>
                <Select
                  fullWidth
                  value={product.name}
                  onChange={(e) => handleProductNameChange(index, e.target.value)}
                >
                  {AVAILABLE_PRODUCTS.map((availableProduct) => (
                    <MenuItem 
                      key={availableProduct.name} 
                      value={availableProduct.name}
                    >
                      {availableProduct.name}
                    </MenuItem>
                  ))}
                </Select>
              </TableCell>
              <TableCell>
                <TextField
                  type="number"
                  value={product.concentration === 0 ? "" : product.concentration}
                  onChange={(e) => onProductChange(index, {
                    ...product,
                    concentration: e.target.value === "" ? 0 : parseFloat(e.target.value)
                  })}
                  inputProps={{ 
                    step: 0.1,
                    placeholder: "Enter concentration"
                  }}
                  fullWidth
                />
              </TableCell>
              <TableCell>
                <TextField
                  value={product.specificGravity}
                  disabled
                  fullWidth
                />
              </TableCell>
              <TableCell>
                <Select
                  fullWidth
                  value={product.additionMethod}
                  onChange={(e) => onProductChange(index, {
                    ...product,
                    additionMethod: e.target.value
                  })}
                >
                  <MenuItem value="lb/bbl">lb/bbl</MenuItem>
                  <MenuItem value="% by volume">% by volume</MenuItem>
                </Select>
              </TableCell>
              <TableCell align="center">
                <Tooltip title="Remove product">
                  <IconButton
                    onClick={() => onProductRemove(index)}
                    color="error"
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}; 