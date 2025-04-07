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
  MenuItem
} from '@mui/material';
import { Product } from '../types/types';

interface ProductTableProps {
  products: Product[];
  onProductChange: (index: number, updatedProduct: Product) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({ products, onProductChange }) => {
  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Select Products to Add</TableCell>
            <TableCell>Concentration</TableCell>
            <TableCell>S.G.</TableCell>
            <TableCell>Select addition method</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product, index) => (
            <TableRow key={index}>
              <TableCell>
                <Select
                  value={product.name}
                  onChange={(e) => onProductChange(index, { ...product, name: e.target.value as string })}
                  fullWidth
                >
                  <MenuItem value={product.name}>{product.name}</MenuItem>
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
              <TableCell>{product.specificGravity}</TableCell>
              <TableCell>
                <Select
                  value={product.additionMethod}
                  onChange={(e) => onProductChange(index, {
                    ...product,
                    additionMethod: e.target.value
                  })}
                  fullWidth
                >
                  <MenuItem value="lb/bbl">lb/bbl</MenuItem>
                  <MenuItem value="% by volume">% by volume</MenuItem>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}; 