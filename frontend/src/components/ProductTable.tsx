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

interface ProductTableProps {
  products: Product[];
  onProductChange: (index: number, product: Product) => void;
  onProductRemove: (index: number) => void;
  availableProducts: { name: string; specificGravity: number }[];
}

export const ProductTable: React.FC<ProductTableProps> = ({ products, onProductChange, onProductRemove, availableProducts }) => {
  const handleProductNameChange = (index: number, productName: string) => {
    const selectedProduct = availableProducts.find(p => p.name === productName);
    if (selectedProduct) {
      onProductChange(index, {
        ...products[index],
        name: productName,
        specificGravity: selectedProduct.specificGravity,
        additionMethod: products[index].additionMethod || 'lb/bbl',
        mixingOrder: products[index].mixingOrder
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
                  onChange={(e) => handleProductNameChange(index, e.target.value as string)}
                >
                  {availableProducts.map((availableProduct) => (
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
                  value={product.concentration || ""}
                  onChange={(e) => onProductChange(index, {
                    ...product,
                    concentration: e.target.value === "" ? 0 : parseFloat(e.target.value)
                  })}
                  inputProps={{ step: 0.1, placeholder: "Enter concentration" }}
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
                    additionMethod: e.target.value as string
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