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
      background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)', 
      color: 'white', 
      p: 3,
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      {/* Logo */}
      <img 
        src={lcwLogo} 
        alt="LC Waikiki" 
        style={{ 
          width: 120, 
          height: 40, 
          cursor: 'pointer' 
        }} 
        onClick={handleHomeClick}
      />

      {/* Page Title */}
      <Typography 
        variant="h5" 
        sx={{ 
          fontWeight: 700, 
          flex: 1,
          fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' }
        }}
      >
        {getPageTitle()}
      </Typography>

      {/* Navigation Buttons */}
      <Box sx={{ 
        display: 'flex', 
        gap: 1, 
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <Button
          variant="outlined"
          startIcon={<HomeIcon />}
          onClick={handleHomeClick}
          sx={{ 
            color: 'white', 
            borderColor: 'white',
            '&:hover': { 
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderColor: 'white'
            },
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            px: { xs: 1, sm: 2 }
          }}
        >
          Ana Sayfa
        </Button>

        <Button
          variant="outlined"
          startIcon={<DashboardIcon />}
          onClick={handleDashboardClick}
          sx={{ 
            color: 'white', 
            borderColor: 'white',
            '&:hover': { 
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderColor: 'white'
            },
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            px: { xs: 1, sm: 2 }
          }}
        >
          Dashboard
        </Button>

        {/* Store/User Dropdown */}
        {storeData ? (
          <Button
            variant="outlined"
            endIcon={<KeyboardArrowDownIcon />}
            onClick={handleMenuOpen}
            sx={{ 
              color: 'white', 
              borderColor: 'white',
              '&:hover': { 
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderColor: 'white'
              },
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              px: { xs: 1, sm: 2 }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <StoreIcon sx={{ fontSize: 16 }} />
              <Box sx={{ 
                display: { xs: 'none', sm: 'block' },
                textAlign: 'left',
                maxWidth: 120,
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                <Typography variant="caption" sx={{ display: 'block', lineHeight: 1 }}>
                  {storeData.name}
                </Typography>
                <Chip 
                  label={storeData.isActive ? 'Aktif' : 'Pasif'} 
                  size="small"
                  color={storeData.isActive ? 'success' : 'default'}
                  sx={{ 
                    height: 16, 
                    fontSize: '0.6rem',
                    '& .MuiChip-label': { px: 0.5 }
                  }}
                />
              </Box>
            </Box>
          </Button>
        ) : (
          <Button
            variant="outlined"
            endIcon={<KeyboardArrowDownIcon />}
            onClick={handleMenuOpen}
            sx={{ 
              color: 'white', 
              borderColor: 'white',
              '&:hover': { 
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderColor: 'white'
              },
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              px: { xs: 1, sm: 2 }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonIcon sx={{ fontSize: 16 }} />
              <Box sx={{ 
                display: { xs: 'none', sm: 'block' },
                textAlign: 'left'
              }}>
                <Typography variant="caption" sx={{ display: 'block', lineHeight: 1 }}>
                  {userData?.name || 'Kullanıcı'}
                </Typography>
                <Typography variant="caption" sx={{ 
                  display: 'block', 
                  lineHeight: 1,
                  opacity: 0.8,
                  fontSize: '0.6rem'
                }}>
                  {userData?.role || 'admin'}
                </Typography>
              </Box>
            </Box>
          </Button>
        )}

        {/* Dropdown Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 200,
              '& .MuiMenuItem-root': {
                py: 1.5,
                px: 2
              }
            }
          }}
        >
          <MenuItem onClick={handleSettingsClick}>
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            Ayarlar
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            Çıkış Yap
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default Navbar;
