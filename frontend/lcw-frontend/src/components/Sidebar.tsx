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
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Dashboard,
  Inventory,
  ShoppingCart,
  TrendingUp,
  Undo,
  Assessment,
  People,
  Settings,
  ChevronLeft,
  ChevronRight,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidthExpanded = 240;
const drawerWidthCollapsed = 72;

const menuItems = [
  { text: 'Genel Bakış', icon: <Dashboard />, path: '/store' },
  { text: 'Ürünler', icon: <Inventory />, path: '/products' },
  { text: 'Satış Yap', icon: <ShoppingCart />, path: '/sales' },
  { text: 'Satış Durumu', icon: <TrendingUp />, path: '/sales-status' },
  { text: 'İadeler', icon: <Undo />, path: '/returns' },
  { text: 'Raporlar', icon: <Assessment />, path: '/reports' },
  { text: 'Personel', icon: <People />, path: '/employees' },
  { text: 'Ayarlar', icon: <Settings />, path: '/settings' },
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: collapsed ? drawerWidthCollapsed : drawerWidthExpanded,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: collapsed ? drawerWidthCollapsed : drawerWidthExpanded,
          boxSizing: 'border-box',
          backgroundColor: '#f8f9fa',
          borderRight: '1px solid #e0e0e0',
          top: '64px', // Navbar yüksekliği
          height: 'calc(100% - 64px)',
          zIndex: 1,
          transition: 'width 0.25s ease',
        },
      }}
    >
      <Box sx={{ overflow: 'auto', pt: 1 }}>
        {/* Collapse Toggle */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-end',
          px: collapsed ? 0 : 1,
          pb: 1,
        }}>
          <Tooltip title={collapsed ? 'Genişlet' : 'Daralt'}>
            <IconButton size="small" onClick={() => setCollapsed((c) => !c)}>
              {collapsed ? <ChevronRight /> : <ChevronLeft />}
            </IconButton>
          </Tooltip>
        </Box>
        <Divider sx={{ mb: 1 }} />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                selected={location.pathname === item.path || (item.path === '/store' && location.pathname.startsWith('/store/'))}
                sx={{
                  mx: 1,
                  borderRadius: 1,
                  justifyContent: collapsed ? 'center' : 'flex-start',
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
                    color: (location.pathname === item.path || (item.path === '/store' && location.pathname.startsWith('/store/'))) ? '#fff' : '#1976d2',
                    minWidth: collapsed ? 'auto' : 40,
                    mr: collapsed ? 0 : 1,
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: '0.85rem',
                      fontWeight: (location.pathname === item.path || (item.path === '/store' && location.pathname.startsWith('/store/'))) ? 600 : 400,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
