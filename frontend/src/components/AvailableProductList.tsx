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
  IconButton,
  Snackbar,
  Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Product, getProducts, deleteProduct } from '../services/products';
import { AlertColor } from '@mui/material/Alert';

const AvailableProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{open: boolean, message: string, severity: AlertColor}>({open: false, message: '', severity: 'success'});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        setError('Failed to fetch available products');
        console.error('Error fetching available products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteProduct(id);
      setProducts(products => products.filter(p => p._id !== id));
      setSnackbar({open: true, message: 'Product deleted successfully!', severity: 'success'});
    } catch (error) {
      setError('Failed to delete product');
      setSnackbar({open: true, message: 'Failed to delete product', severity: 'error'});
      console.error('Error deleting product:', error);
    } finally {
      setDeletingId(null);
    }
  };

  if (error) {
    return (
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography color="error">{error}</Typography>
      </Paper>
    );
  }

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
              <TableCell align="right">Specific Gravity</TableCell>
              <TableCell>Function</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id}>
                <TableCell>{product.name}</TableCell>
                <TableCell align="right">{product.specificGravity}</TableCell>
                <TableCell>{product.function}</TableCell>
                <TableCell align="center">
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(product._id)}
                    disabled={deletingId === product._id}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({...snackbar, open: false})}>
        <Alert elevation={6} variant="filled" onClose={() => setSnackbar({...snackbar, open: false})} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default AvailableProductList; 