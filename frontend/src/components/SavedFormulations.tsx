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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Formulation, getFormulations, deleteFormulation } from '../services/formulations';

const SavedFormulations: React.FC = () => {
  const [formulations, setFormulations] = useState<Formulation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedFormulation, setSelectedFormulation] = useState<Formulation | null>(null);

  const fetchFormulations = async () => {
    try {
      const data = await getFormulations();
      setFormulations(data);
    } catch (error) {
      setError('Failed to fetch saved formulations');
      console.error('Error fetching formulations:', error);
    }
  };

  useEffect(() => {
    fetchFormulations();
  }, []);

  const handleDeleteClick = (formulation: Formulation) => {
    setSelectedFormulation(formulation);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedFormulation) {
      try {
        await deleteFormulation(selectedFormulation._id);
        await fetchFormulations(); // Refresh the list
        setDeleteDialogOpen(false);
        setSelectedFormulation(null);
      } catch (error) {
        setError('Failed to delete formulation');
        console.error('Error deleting formulation:', error);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedFormulation(null);
  };

  if (error) {
    return (
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography color="error">{error}</Typography>
      </Paper>
    );
  }

  return (
    <>
      <div className="p-6">
        <Typography variant="h4" className="mb-4">
          Saved Formulations
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mud Type</TableCell>
                <TableCell align="right">Mud Weight</TableCell>
                <TableCell align="right">Desired Oil %</TableCell>
                <TableCell>Products</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {formulations.map((formulation) => (
                <TableRow key={formulation._id}>
                  <TableCell>{formulation.mudType}</TableCell>
                  <TableCell align="right">{formulation.mudWeight}</TableCell>
                  <TableCell align="right">{formulation.desiredOilPercentage}%</TableCell>
                  <TableCell>
                    <ul className="list-disc list-inside">
                      {formulation.products.map((product, index) => (
                        <li key={index}>
                          {product.product.name}: {product.quantity}
                        </li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell>
                    {new Date(formulation.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={() => handleDeleteClick(formulation)}
                      color="error"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Formulation</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this formulation? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SavedFormulations; 