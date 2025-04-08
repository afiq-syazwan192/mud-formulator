import React, { useEffect, useState } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Formulation, getFormulations, deleteFormulation } from '../services/formulations';

const SavedFormulations: React.FC = () => {
  const [formulations, setFormulations] = useState<Formulation[]>([]);

  const fetchFormulations = async () => {
    try {
      const data = await getFormulations();
      setFormulations(data);
    } catch (error) {
      console.error('Error fetching formulations:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteFormulation(id);
      await fetchFormulations(); // Refresh the list
    } catch (error) {
      console.error('Error deleting formulation:', error);
    }
  };

  useEffect(() => {
    fetchFormulations();
  }, []);

  return (
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
              <TableCell>Actions</TableCell>
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
                <TableCell>
                  <IconButton
                    onClick={() => handleDelete(formulation._id)}
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
  );
};

export default SavedFormulations; 