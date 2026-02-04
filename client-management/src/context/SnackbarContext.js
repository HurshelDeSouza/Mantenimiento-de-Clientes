import React, { createContext, useContext, useState } from 'react';

const SnackbarContext = createContext();

export const SnackbarProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const showSuccess = (message) => {
    setSnackbar({ open: true, message, severity: 'success' });
  };

  const showError = (message) => {
    setSnackbar({ open: true, message, severity: 'error' });
  };

  const showWarning = (message) => {
    setSnackbar({ open: true, message, severity: 'warning' });
  };

  const showInfo = (message) => {
    setSnackbar({ open: true, message, severity: 'info' });
  };

  const closeSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <SnackbarContext.Provider
      value={{
        snackbar,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        closeSnackbar,
      }}
    >
      {children}
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar debe usarse dentro de SnackbarProvider');
  }
  return context;
};
