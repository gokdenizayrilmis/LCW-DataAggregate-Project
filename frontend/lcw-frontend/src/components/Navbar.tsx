import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Avatar,
  Chip
} from '@mui/material';
import {
  Store as StoreIcon,
  Dashboard as DashboardIcon,
  Home as HomeIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import lcwLogo from '../assets/lcw-logo.png';

interface NavbarProps {
  storeData?: {
    id: number;
    name: string;
    isActive: boolean;
  };
  userData?: {
    name: string;
    email: string;
    role: string;
  };
}

const Navbar: React.FC<NavbarProps> = ({ storeData, userData }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleDashboardClick = () => {
    navigate('/dashboard');
  };

  const handleSettingsClick = () => {
    handleMenuClose();
    // TODO: Implement settings functionality
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
    navigate('/');
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const getPageTitle = () => {
    if (location.pathname === '/dashboard') {
      return 'LCW Yönetim Sistemi - Dashboard';
    } else if (location.pathname.startsWith('/store/')) {
      return `${storeData?.name || 'Mağaza'} - Mağaza Yönetim Paneli`;
    }
    return 'LC Waikiki Yönetim Paneli';
  };

  return (
    <Box sx={{ 
      backgroundColor: '#1976d2',
      color: 'white', 
      py: 1,
      px: 2,
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
      borderBottom: '2px solid #1565c0',
      position: 'sticky',
      top: 0,
      zIndex: 1100
    }}>
      {/* Logo */}
      <Box 
        onClick={handleHomeClick}
        sx={{
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          transition: 'transform 0.2s ease',
          '&:hover': {
            transform: 'scale(1.05)'
          }
        }}
      >
        <img 
          src={lcwLogo} 
          alt="LC Waikiki" 
          style={{ 
            width: 100, 
            height: 32
          }} 
        />
      </Box>

      {/* Page Title */}
      <Typography 
        variant="body1" 
        sx={{ 
          fontWeight: 600, 
          flex: 1,
          fontSize: { xs: '0.9rem', sm: '1rem' },
          display: { xs: 'none', md: 'block' }
        }}
      >
        {storeData?.name || 'Mağaza Paneli'}
      </Typography>

      {/* Store Info Badge - Mobile */}
      {storeData && (
        <Box sx={{ 
          display: { xs: 'flex', md: 'none' },
          flex: 1,
          alignItems: 'center',
          gap: 0.5,
          backgroundColor: 'rgba(255,255,255,0.15)',
          px: 1.5,
          py: 0.5,
          borderRadius: 1.5
        }}>
          <StoreIcon sx={{ fontSize: 16 }} />
          <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
            {storeData.name}
          </Typography>
        </Box>
      )}

      {/* Navigation Buttons */}
      <Box sx={{ 
        display: 'flex', 
        gap: 1, 
        alignItems: 'center'
      }}>
        {/* User Menu Button */}
        <Button
          variant="contained"
          endIcon={<KeyboardArrowDownIcon />}
          onClick={handleMenuOpen}
          sx={{ 
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: 'white',
            backdropFilter: 'blur(10px)',
            '&:hover': { 
              backgroundColor: 'rgba(255,255,255,0.3)',
            },
            fontSize: { xs: '0.75rem', sm: '0.8rem' },
            px: { xs: 1.5, sm: 2 },
            py: 0.75,
            borderRadius: 1.5,
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: 'none'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar 
              sx={{ 
                width: 28, 
                height: 28,
                bgcolor: 'rgba(255,255,255,0.3)',
                fontSize: '0.75rem',
                fontWeight: 700
              }}
            >
              {storeData?.name?.charAt(0) || userData?.name?.charAt(0) || 'U'}
            </Avatar>
            <Box sx={{ 
              display: { xs: 'none', sm: 'block' },
              textAlign: 'left'
            }}>
              <Typography variant="body2" sx={{ 
                display: 'block', 
                lineHeight: 1.2,
                fontWeight: 600,
                fontSize: '0.85rem'
              }}>
                {storeData?.name || userData?.name || 'Kullanıcı'}
              </Typography>
              {storeData && (
                <Chip 
                  label={storeData.isActive ? 'Aktif' : 'Pasif'} 
                  size="small"
                  sx={{ 
                    height: 16,
                    mt: 0.25,
                    fontSize: '0.6rem',
                    fontWeight: 600,
                    backgroundColor: storeData.isActive ? '#4caf50' : '#757575',
                    color: 'white',
                    '& .MuiChip-label': { px: 0.75 }
                  }}
                />
              )}
            </Box>
          </Box>
        </Button>

        {/* Dropdown Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              mt: 1.5,
              minWidth: 240,
              borderRadius: 2,
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              '& .MuiMenuItem-root': {
                py: 1.5,
                px: 2.5,
                borderRadius: 1,
                mx: 1,
                my: 0.5,
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  transform: 'translateX(4px)'
                }
              }
            }
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          {/* User Info Header */}
          {(storeData || userData) && (
            <>
              <Box sx={{ px: 2.5, py: 2, backgroundColor: '#f5f5f5' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar sx={{ 
                    bgcolor: '#1976d2',
                    width: 48,
                    height: 48,
                    fontSize: '1.25rem',
                    fontWeight: 700
                  }}>
                    {storeData?.name?.charAt(0) || userData?.name?.charAt(0) || 'U'}
                  </Avatar>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 700, color: '#333' }}>
                      {storeData?.name || userData?.name || 'Kullanıcı'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666', fontSize: '0.85rem' }}>
                      {userData?.email || storeData?.name}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Divider sx={{ my: 1 }} />
            </>
          )}
          
          <MenuItem onClick={handleSettingsClick}>
            <ListItemIcon>
              <SettingsIcon fontSize="small" sx={{ color: '#1976d2' }} />
            </ListItemIcon>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Ayarlar
            </Typography>
          </MenuItem>
          
          <Divider sx={{ my: 1 }} />
          
          <MenuItem 
            onClick={handleLogout}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(211, 47, 47, 0.08) !important',
              }
            }}
          >
            <ListItemIcon>
              <LogoutIcon fontSize="small" sx={{ color: '#d32f2f' }} />
            </ListItemIcon>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#d32f2f' }}>
              Çıkış Yap
            </Typography>
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default Navbar;
