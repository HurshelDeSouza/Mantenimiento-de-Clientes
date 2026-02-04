import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Avatar,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  PhotoCamera as PhotoCameraIcon,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { useClient } from '../context/ClientContext';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';

const initialFormData = {
  nombre: '',
  apellidos: '',
  identificacion: '',
  telefonoCelular: '',
  otroTelefono: '',
  direccion: '',
  fNacimiento: null,
  fAfiliacion: null,
  sexo: '',
  resenaPersonal: '',
  imagen: '',
  interesFK: '',
};

const ClientForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { interests, getInterests, getClient, createClient, updateClient, clearCurrentClient } = useClient();
  const { showSuccess, showError } = useSnackbar();

  const [formData, setFormData] = useState(initialFormData);
  const [clientId, setClientId] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  const isEditing = !!id;

  useEffect(() => {
    loadInterests();
    if (isEditing) {
      loadClient();
    }
    return () => clearCurrentClient();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadInterests = async () => {
    try {
      await getInterests();
    } catch (error) {
      showError('Error al cargar intereses');
    }
  };

  const loadClient = async () => {
    setLoadingData(true);
    try {
      const client = await getClient(id);
      setClientId(client.id);
      setFormData({
        nombre: client.nombre || '',
        apellidos: client.apellidos || '',
        identificacion: client.identificacion || '',
        telefonoCelular: client.telefonoCelular || '',
        otroTelefono: client.otroTelefono || '',
        direccion: client.direccion || '',
        fNacimiento: client.fNacimiento ? dayjs(client.fNacimiento) : null,
        fAfiliacion: client.fAfiliacion ? dayjs(client.fAfiliacion) : null,
        sexo: client.sexo || '',
        resenaPersonal: client.resenaPersonal || '',
        imagen: client.imagen || '',
        interesFK: client.interesesId || '',
      });
    } catch (error) {
      showError('Error al cargar cliente');
      navigate('/clientes');
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleDateChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, imagen: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = 'Requerido';
    if (formData.nombre.length > 50) newErrors.nombre = 'Máximo 50 caracteres';
    if (!formData.apellidos.trim()) newErrors.apellidos = 'Requerido';
    if (formData.apellidos.length > 100) newErrors.apellidos = 'Máximo 100 caracteres';
    if (!formData.identificacion.trim()) newErrors.identificacion = 'Requerido';
    if (formData.identificacion.length > 20) newErrors.identificacion = 'Máximo 20 caracteres';
    if (!formData.telefonoCelular.trim()) newErrors.telefonoCelular = 'Requerido';
    if (formData.telefonoCelular.length > 20) newErrors.telefonoCelular = 'Máximo 20 caracteres';
    if (!formData.otroTelefono.trim()) newErrors.otroTelefono = 'Requerido';
    if (formData.otroTelefono.length > 20) newErrors.otroTelefono = 'Máximo 20 caracteres';
    if (!formData.direccion.trim()) newErrors.direccion = 'Requerido';
    if (formData.direccion.length > 200) newErrors.direccion = 'Máximo 200 caracteres';
    if (!formData.fNacimiento) newErrors.fNacimiento = 'Requerido';
    if (!formData.fAfiliacion) newErrors.fAfiliacion = 'Requerido';
    if (!formData.sexo) newErrors.sexo = 'Requerido';
    if (!formData.resenaPersonal.trim()) newErrors.resenaPersonal = 'Requerido';
    if (formData.resenaPersonal.length > 200) newErrors.resenaPersonal = 'Máximo 200 caracteres';
    if (!formData.interesFK) newErrors.interesFK = 'Requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      let payload;

      if (isEditing) {
        payload = {
          id: clientId,
          nombre: formData.nombre.trim(),
          apellidos: formData.apellidos.trim(),
          identificacion: formData.identificacion.trim(),
          celular: formData.telefonoCelular.trim(),
          otroTelefono: formData.otroTelefono.trim(),
          direccion: formData.direccion.trim(),
          fNacimiento: formData.fNacimiento ? formData.fNacimiento.toISOString() : null,
          fAfiliacion: formData.fAfiliacion ? formData.fAfiliacion.toISOString() : null,
          sexo: formData.sexo,
          resennaPersonal: formData.resenaPersonal.trim(),
          imagen: formData.imagen || '',
          interesFK: formData.interesFK,
          usuarioId: user?.userid,
        };
      } else {
        payload = {
          nombre: formData.nombre.trim(),
          apellidos: formData.apellidos.trim(),
          identificacion: formData.identificacion.trim(),
          telefonoCelular: formData.telefonoCelular.trim(),
          Celular: formData.telefonoCelular.trim(),
          otroTelefono: formData.otroTelefono.trim(),
          direccion: formData.direccion.trim(),
          fNacimiento: formData.fNacimiento ? formData.fNacimiento.format('YYYY-MM-DD') : null,
          fAfiliacion: formData.fAfiliacion ? formData.fAfiliacion.format('YYYY-MM-DD') : null,
          sexo: formData.sexo,
          resenaPersonal: formData.resenaPersonal.trim(),
          imagen: formData.imagen || '',
          interesFK: formData.interesFK,
          usuarioId: user?.userid || '',
        };
      }

      if (isEditing) {
        await updateClient(payload);
        showSuccess('Cliente actualizado correctamente');
      } else {
        const result = await createClient(payload);
        showSuccess('Cliente creado correctamente');
      }
      navigate('/clientes');
    } catch (error) {
      console.error('Error completo:', error);
      console.error('Error response:', error.response?.data);
      showError('Error al guardar cliente');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const textFieldStyle = {
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: '#ccc' },
    },
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ position: 'relative', mr: 2 }}>
              <Avatar
                src={formData.imagen}
                sx={{ width: 50, height: 50, bgcolor: '#e0e0e0' }}
              >
                <PersonIcon sx={{ fontSize: 30, color: '#666' }} />
              </Avatar>
              <input
                accept="image/*"
                type="file"
                id="image-upload"
                hidden
                onChange={handleImageChange}
              />
              <label htmlFor="image-upload">
                <IconButton
                  component="span"
                  size="small"
                  sx={{
                    position: 'absolute',
                    bottom: -5,
                    right: -5,
                    bgcolor: 'white',
                    boxShadow: 1,
                    '&:hover': { bgcolor: '#f5f5f5' },
                  }}
                >
                  <PhotoCameraIcon fontSize="small" />
                </IconButton>
              </label>
            </Box>
            <Typography variant="h6" fontWeight="bold" color="#1a1a2e">
              Mantenimiento de clientes
            </Typography>
          </Box>
          <Box>
            <Button
              variant="outlined"
              size="small"
              startIcon={<SaveIcon />}
              onClick={handleSubmit}
              disabled={loading}
              sx={{ 
                mr: 1,
                borderColor: '#ccc',
                color: '#333',
                '&:hover': { borderColor: '#999', bgcolor: 'transparent' },
              }}
            >
              {loading ? <CircularProgress size={16} /> : 'Guardar'}
            </Button>
            <Button 
              variant="outlined"
              size="small"
              startIcon={<ArrowBackIcon />} 
              onClick={() => navigate('/clientes')}
              sx={{ 
                borderColor: '#ccc',
                color: '#333',
                '&:hover': { borderColor: '#999', bgcolor: 'transparent' },
              }}
            >
              Regresar
            </Button>
          </Box>
        </Box>

        {/* Formulario */}
        <Grid container spacing={2}>
          {/* Fila 1: Identificación, Nombre, Apellidos */}
          <Grid item xs={12} md={4}>
            <TextField
              name="identificacion"
              label="Identificación"
              value={formData.identificacion}
              onChange={handleChange}
              error={!!errors.identificacion}
              helperText={errors.identificacion}
              fullWidth
              size="small"
              inputProps={{ maxLength: 20 }}
              sx={textFieldStyle}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              name="nombre"
              label="Nombre"
              value={formData.nombre}
              onChange={handleChange}
              error={!!errors.nombre}
              helperText={errors.nombre}
              fullWidth
              size="small"
              inputProps={{ maxLength: 50 }}
              sx={textFieldStyle}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              name="apellidos"
              label="Apellidos"
              value={formData.apellidos}
              onChange={handleChange}
              error={!!errors.apellidos}
              helperText={errors.apellidos}
              fullWidth
              size="small"
              inputProps={{ maxLength: 100 }}
              sx={textFieldStyle}
            />
          </Grid>

          {/* Fila 2: Género, Fecha nacimiento, Fecha afiliación */}
          <Grid item xs={12} md={4}>
            <TextField
              name="sexo"
              label="Género *"
              select
              value={formData.sexo}
              onChange={handleChange}
              error={!!errors.sexo}
              helperText={errors.sexo}
              fullWidth
              size="small"
              sx={textFieldStyle}
            >
              <MenuItem value="M">Masculino</MenuItem>
              <MenuItem value="F">Femenino</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <DatePicker
              label="Fecha de nacimiento"
              value={formData.fNacimiento}
              onChange={(value) => handleDateChange('fNacimiento', value)}
              format="DD/MM/YYYY"
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: 'small',
                  error: !!errors.fNacimiento,
                  helperText: errors.fNacimiento,
                  sx: textFieldStyle,
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <DatePicker
              label="Fecha de afiliación"
              value={formData.fAfiliacion}
              onChange={(value) => handleDateChange('fAfiliacion', value)}
              format="DD/MM/YYYY"
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: 'small',
                  error: !!errors.fAfiliacion,
                  helperText: errors.fAfiliacion,
                  sx: textFieldStyle,
                },
              }}
            />
          </Grid>

          {/* Fila 3: Teléfono Celular, Teléfono Otro, Interés */}
          <Grid item xs={12} md={4}>
            <TextField
              name="telefonoCelular"
              label="Teléfono Celular"
              value={formData.telefonoCelular}
              onChange={handleChange}
              error={!!errors.telefonoCelular}
              helperText={errors.telefonoCelular}
              fullWidth
              size="small"
              inputProps={{ maxLength: 20 }}
              sx={textFieldStyle}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              name="otroTelefono"
              label="Teléfono Otro"
              value={formData.otroTelefono}
              onChange={handleChange}
              error={!!errors.otroTelefono}
              helperText={errors.otroTelefono}
              fullWidth
              size="small"
              inputProps={{ maxLength: 20 }}
              sx={textFieldStyle}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              name="interesFK"
              label="Interes *"
              select
              value={formData.interesFK}
              onChange={handleChange}
              error={!!errors.interesFK}
              helperText={errors.interesFK}
              fullWidth
              size="small"
              sx={textFieldStyle}
            >
              <MenuItem value="">Seleccione</MenuItem>
              {interests.map((interest) => (
                <MenuItem key={interest.id} value={interest.id}>
                  {interest.descripcion}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Fila 4: Dirección */}
          <Grid item xs={12}>
            <TextField
              name="direccion"
              label="Dirección"
              value={formData.direccion}
              onChange={handleChange}
              error={!!errors.direccion}
              helperText={errors.direccion}
              fullWidth
              size="small"
              inputProps={{ maxLength: 200 }}
              sx={textFieldStyle}
            />
          </Grid>

          {/* Fila 5: Reseña */}
          <Grid item xs={12}>
            <TextField
              name="resenaPersonal"
              label="Reseña"
              value={formData.resenaPersonal}
              onChange={handleChange}
              error={!!errors.resenaPersonal}
              helperText={errors.resenaPersonal}
              fullWidth
              size="small"
              inputProps={{ maxLength: 200 }}
              sx={textFieldStyle}
            />
          </Grid>
        </Grid>
      </Paper>
    </LocalizationProvider>
  );
};

export default ClientForm;
