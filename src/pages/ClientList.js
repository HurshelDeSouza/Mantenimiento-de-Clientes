import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  CircularProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useClient } from '../context/ClientContext';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';
import ConfirmDialog from '../components/ConfirmDialog';

const ClientList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { clients, loading, searchClients, deleteClient } = useClient();
  const { showSuccess, showError } = useSnackbar();

  const [filters, setFilters] = useState({ nombre: '', identificacion: '' });
  const [appliedFilters, setAppliedFilters] = useState({ nombre: '', identificacion: '' });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, clientId: null });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    loadClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadClients = async () => {
    try {
      await searchClients({
        nombre: '',
        identificacion: '',
        usuarioId: user?.userid || '',
      });
    } catch (error) {
      showError('Error al buscar clientes');
    }
  };

  const filteredClients = clients.filter((client) => {
    const matchNombre = !appliedFilters.nombre || 
      `${client.nombre} ${client.apellidos}`.toLowerCase().includes(appliedFilters.nombre.toLowerCase());
    const matchIdentificacion = !appliedFilters.identificacion || 
      client.identificacion?.toLowerCase().includes(appliedFilters.identificacion.toLowerCase());
    return matchNombre && matchIdentificacion;
  });

  const paginatedClients = filteredClients.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = () => {
    setAppliedFilters({ ...filters });
    setPage(0);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    // Si se borra el filtro, aplicar automáticamente
    if (value === '') {
      setAppliedFilters((prev) => ({ ...prev, [name]: '' }));
      setPage(0);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleDelete = async () => {
    try {
      await deleteClient(deleteDialog.clientId);
      showSuccess('Cliente eliminado correctamente');
      setDeleteDialog({ open: false, clientId: null });
    } catch (error) {
      showError('Error al eliminar cliente');
    }
  };

  const openDeleteDialog = (clientId) => {
    setDeleteDialog({ open: true, clientId });
  };

  return (
    <Paper sx={{ p: 2, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight="bold" color="#1a1a2e">
          Consulta de clientes
        </Typography>
        <Box>
          <Button
            variant="outlined"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => navigate('/clientes/nuevo')}
            sx={{ 
              mr: 1,
              borderColor: '#ccc',
              color: '#333',
              '&:hover': { borderColor: '#999', bgcolor: 'transparent' },
            }}
          >
            Agregar
          </Button>
          <Button 
            variant="outlined"
            size="small"
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate('/home')}
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

      {/* Filtros */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
        <TextField
          name="nombre"
          label="Nombre"
          value={filters.nombre}
          onChange={handleFilterChange}
          onKeyPress={handleKeyPress}
          size="small"
          sx={{ 
            flex: 1,
            bgcolor: 'white',
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#ccc' },
            },
          }}
        />
        <TextField
          name="identificacion"
          label="Identificación"
          value={filters.identificacion}
          onChange={handleFilterChange}
          onKeyPress={handleKeyPress}
          size="small"
          sx={{ 
            flex: 1,
            bgcolor: 'white',
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#ccc' },
            },
          }}
        />
        <IconButton
          onClick={handleSearch}
          size="small"
          sx={{ 
            bgcolor: 'white', 
            border: '1px solid #ccc',
            borderRadius: '50%',
            '&:hover': { bgcolor: '#f5f5f5' },
          }}
        >
          <SearchIcon />
        </IconButton>
      </Box>

      {/* Tabla */}
      <TableContainer sx={{ border: '1px solid #e0e0e0', borderRadius: 1 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#1976d2' }}>
              <TableCell 
                sx={{ 
                  color: 'white', 
                  fontWeight: 'bold', 
                  py: 1,
                  width: '200px',
                  borderRight: '1px solid rgba(255,255,255,0.3)',
                }}
              >
                Identificación
              </TableCell>
              <TableCell 
                sx={{ 
                  color: 'white', 
                  fontWeight: 'bold', 
                  py: 1,
                  borderRight: '1px solid rgba(255,255,255,0.3)',
                }}
              >
                Nombre completo
              </TableCell>
              <TableCell 
                sx={{ 
                  color: 'white', 
                  fontWeight: 'bold', 
                  py: 1,
                  width: '100px',
                }} 
                align="center"
              >
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : filteredClients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                  No se encontraron clientes
                </TableCell>
              </TableRow>
            ) : (
              paginatedClients.map((client, index) => (
                <TableRow 
                  key={client.id} 
                  sx={{ 
                    bgcolor: index % 2 === 0 ? 'white' : '#fafafa',
                    '&:hover': { bgcolor: '#f0f0f0' },
                  }}
                >
                  <TableCell 
                    sx={{ 
                      py: 1, 
                      borderBottom: '1px solid #e0e0e0',
                      borderRight: '1px solid #e0e0e0',
                      width: '200px',
                    }}
                  >
                    {client.identificacion}
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      py: 1, 
                      borderBottom: '1px solid #e0e0e0',
                      borderRight: '1px solid #e0e0e0',
                    }}
                  >
                    {`${client.nombre} ${client.apellidos}`}
                  </TableCell>
                  <TableCell 
                    align="center" 
                    sx={{ 
                      py: 0.5, 
                      borderBottom: '1px solid #e0e0e0',
                      width: '100px',
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/clientes/editar/${client.id}`)}
                      sx={{ color: '#666' }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={() => openDeleteDialog(client.id)}
                      sx={{ color: '#666' }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredClients.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[10, 20, 30]}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        sx={{ '& .MuiTablePagination-toolbar': { minHeight: 40 } }}
      />

      <ConfirmDialog
        open={deleteDialog.open}
        title="Confirmar eliminación"
        message="¿Está seguro que desea eliminar este cliente?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ open: false, clientId: null })}
      />
    </Paper>
  );
};

export default ClientList;
