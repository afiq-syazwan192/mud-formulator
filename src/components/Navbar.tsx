import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
  };

  const buttonStyle = (active: boolean) => ({
    color: 'white',
    borderBottom: active ? '2px solid white' : 'none',
    borderRadius: 0,
  });

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/" style={linkStyle}>
            Mud Formulator
          </Link>
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            component={Link}
            to="/"
            sx={buttonStyle(isActive('/'))}
          >
            Formulator
          </Button>
          <Button
            component={Link}
            to="/available-products"
            sx={buttonStyle(isActive('/available-products'))}
          >
            Available Products
          </Button>
          <Button
            component={Link}
            to="/saved-formulations"
            sx={buttonStyle(isActive('/saved-formulations'))}
          >
            Saved Formulations
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 