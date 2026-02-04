import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ExitToApp as LogoutIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 260;

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleMobileDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { text: 'INICIO', path: '/home', prefix: 'IN' },
    { text: 'Consulta Clientes', path: '/clientes', prefix: 'CC' },
  ];

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#e8f4f8' }}>
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Avatar 
          sx={{ 
            width: 100, 
            height: 100, 
            mx: 'auto', 
            mb: 2, 
            bgcolor: '#1a1a2e',
          }}
        >
          <PersonIcon sx={{ fontSize: 60, color: 'white' }} />
        </Avatar>
        <Typography variant="body1" fontWeight="bold" color="#1a1a2e">
          {user?.username || 'Nombre de Usuario'}
        </Typography>
      </Box>
      <Divider sx={{ borderColor: '#ccc' }} />
      <Box sx={{ py: 2, textAlign: 'center' }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 'bold',
            color: '#1a1a2e',
          }}
        >
          MENÚ
        </Typography>
      </Box>
      <Divider sx={{ borderColor: '#ccc' }} />
      <List sx={{ px: 2, pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              selected={location.pathname === item.path || 
                (item.path === '/clientes' && location.pathname.startsWith('/clientes'))}
              onClick={() => navigate(item.path)}
              sx={{
                py: 0.5,
                '&.Mui-selected': {
                  backgroundColor: 'transparent',
                },
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.04)',
                },
              }}
            >
              <Typography 
                variant="body1" 
                sx={{ 
                  minWidth: 35,
                  color: '#00bcd4',
                  fontWeight: 'bold',
                }}
              >
                {item.prefix}
              </Typography>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{
                  fontSize: '1rem',
                  color: '#1a1a2e',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: '100%',
          bgcolor: '#1a1a2e',
          boxShadow: 'none',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          borderBottom: '3px solid #0288d1',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleMobileDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 1, display: { xs: 'none', sm: 'flex' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 500 }}>
            COMPANIA PRUEBA
          </Typography>
          <Typography variant="body1" sx={{ mr: 1 }}>
            {user?.username || 'Nombre de Usuario'}
          </Typography>
          <IconButton color="inherit" onClick={handleLogout} size="small">
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleMobileDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              mt: '64px',
              borderRight: '1px solid #e0e0e0',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="persistent"
          open={sidebarOpen}
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              mt: '64px',
              borderRight: '1px solid #e0e0e0',
              height: 'calc(100% - 64px)',
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: '64px',
          minHeight: 'calc(100vh - 64px)',
          backgroundColor: '#f5f5f5',
          transition: 'margin-left 0.3s',
          marginLeft: { xs: 0, sm: sidebarOpen ? `${drawerWidth}px` : 0 },
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
