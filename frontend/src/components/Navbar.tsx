import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../services/auth';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Don't show navbar on login page
  if (location.pathname === '/login') {
    return null;
  }

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
          <Button
            onClick={handleLogout}
            sx={{
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 