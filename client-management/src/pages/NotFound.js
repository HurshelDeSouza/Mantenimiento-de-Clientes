import React from 'react';
import { Box, Typography } from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';

const NotFound = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 200px)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <WarningIcon sx={{ fontSize: 80, color: 'secondary.main', mr: 2 }} />
        <Typography variant="h1" color="secondary.main" fontWeight="bold">
          404
        </Typography>
      </Box>
      <Typography variant="h4" color="text.secondary">
        Oops... Page Not Found!
      </Typography>
    </Box>
  );
};

export default NotFound;
