import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
  Typography,
} from '@mui/material';
import {
  Dashboard,
  Store,
  Inventory,
  People,
  CalendarMonth,
  Assessment,
  Settings,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
  { text: 'Toplam Mağaza', icon: <Store />, path: '/stores' },
  { text: 'Mağaza Yönetimi', icon: <Settings />, path: '/store-management' },
  { text: 'Ürünler', icon: <Inventory />, path: '/products' },
  { text: 'Envanter', icon: <Assessment />, path: '/inventory' },
  { text: 'Kullanıcılar', icon: <People />, path: '/users' },
  { text: 'Yardım & Destek', icon: <CalendarMonth />, path: '/support' },
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#f8f9fa',
          borderRight: '1px solid #e0e0e0',
          top: '64px', // Navbar yüksekliği
          height: 'calc(100% - 64px)',
          zIndex: 1,
        },
      }}
    >
      <Box sx={{ overflow: 'auto', pt: 2 }}>
        <List>
          {menuItems.map((item, index) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                selected={location.pathname === item.path}
                sx={{
                  mx: 1,
                  borderRadius: 1,
                  '&.Mui-selected': {
                    backgroundColor: '#1976d2',
                    color: '#fff',
                    '&:hover': {
                      backgroundColor: '#1565c0',
                    },
                    '& .MuiListItemIcon-root': {
                      color: '#fff',
                    },
                  },
                  '&:hover': {
                    backgroundColor: '#e3f2fd',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: location.pathname === item.path ? '#fff' : '#1976d2',
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.95rem',
                    fontWeight: location.pathname === item.path ? 600 : 400,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
