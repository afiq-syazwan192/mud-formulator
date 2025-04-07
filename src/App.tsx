import React from 'react';
import { CssBaseline, Container, ThemeProvider, createTheme } from '@mui/material';
import { MudFormulator } from './components/MudFormulator';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <MudFormulator />
      </Container>
    </ThemeProvider>
  );
}

export default App; 