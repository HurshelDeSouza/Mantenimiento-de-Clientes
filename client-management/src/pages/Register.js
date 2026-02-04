import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { showSuccess, showError } = useSnackbar();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    const hasMinLength = password.length > 8 && password.length <= 20;
    const hasNumber = /\d/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    return hasMinLength && hasNumber && hasUpperCase && hasLowerCase;
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'El nombre de usuario es requerido';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El correo es requerido';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Ingrese un correo válido';
    }
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'La contraseña debe tener entre 8 y 20 caracteres, incluir números, mayúsculas y minúsculas';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await register(formData.username, formData.email, formData.password);
      showSuccess('Usuario creado correctamente');
      navigate('/login');
    } catch (error) {
      const message = error.response?.data?.message || 'Error al registrar usuario';
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f7fa',
        p: 2,
      }}
    >
      <Paper elevation={0} sx={{ p: 4, maxWidth: 400, width: '100%', borderRadius: 2 }}>
        <Typography variant="h5" align="center" gutterBottom sx={{ mb: 3, color: 'text.secondary' }}>
          Registro
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            name="username"
            label="Nombre Usuario"
            value={formData.username}
            onChange={handleChange}
            error={!!errors.username}
            helperText={errors.username}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            name="email"
            label="Dirección de correo"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            name="password"
            label="Contraseña"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            required
            sx={{ mb: 3 }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{ mb: 2, py: 1.5 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'REGISTRARME'}
          </Button>
          <Typography align="center" variant="body2">
            ¿Ya tiene una cuenta?{' '}
            <Link component={RouterLink} to="/login" color="secondary">
              Inicie sesión
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Register;
