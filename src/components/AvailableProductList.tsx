import React, { useEffect, useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import axios from 'axios';

interface AvailableProduct {
  name: string;
  specificGravity: number;
  function: string;
}

const AvailableProductList: React.FC = () => {
  const [products, setProducts] = useState<AvailableProduct[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<AvailableProduct[]>('/api/available-products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching available products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Available Products
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product Name</TableCell>
              <TableCell>Specific Gravity</TableCell>
              <TableCell>Function</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.name}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.specificGravity}</TableCell>
                <TableCell>{product.function}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default AvailableProductList; 