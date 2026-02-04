import React from 'react';
import { Box, Typography } from '@mui/material';

const Home = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 200px)',
      }}
    >
      <Typography variant="h3" fontWeight="bold">
        Bienvenido
      </Typography>
    </Box>
  );
};

export default Home;
