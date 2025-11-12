import React, { useState } from 'react';
import { 
  AppBar, Toolbar, Typography, Button, Box, IconButton, 
  Menu, MenuItem, Avatar, Badge, Divider,
  ListItemIcon, ListItemText, Tooltip, Switch
} from '@mui/material';
import { 
  AccountCircle, Logout, Settings, Dashboard, 
  Notifications as NotificationsIcon, 
  DarkMode as DarkModeIcon, 
  LightMode as LightModeIcon,
  Search as SearchIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import lcwLogo from '../assets/lcw-logo.png';

const AdminNavbar: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Yeni mağaza eklendi: Kadıköy Şube", type: "info", time: "5 dk önce" },
    { id: 2, message: "Stok uyarısı: X ürünü kritik seviyede", type: "warning", time: "10 dk önce" },
    { id: 3, message: "Sistem güncellemesi tamamlandı", type: "success", time: "1 saat önce" },
  ]);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
    navigate('/');
  };

  const userData = localStorage.getItem('userData');
  const user = userData ? JSON.parse(userData) : null;

  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);


  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  return (
    <AppBar position="fixed" sx={{ 
      background: darkMode 
        ? 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)'
        : 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)', 
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
      width: '100%',
      zIndex: (theme) => theme.zIndex.drawer + 1
    }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Logo ve Başlık */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2, 
            cursor: 'pointer',
            '&:hover': {
              opacity: 0.9
            }
          }}
          onClick={() => navigate('/dashboard')}
        >
          <img src={lcwLogo} alt="LC Waikiki" style={{ width: 150, height: 50, objectFit: 'contain' }} />
        </Box>



        {/* Sağ Taraf İkonları */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Bildirimler */}
          <Tooltip title="Bildirimler">
            <IconButton color="inherit" onClick={handleNotificationClick}>
              <Badge badgeContent={notifications.length} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Tema Değiştirme */}
          <Tooltip title={darkMode ? "Açık Tema" : "Koyu Tema"}>
            <IconButton color="inherit" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>

          {/* Ayarlar */}
          <Tooltip title="Ayarlar">
            <IconButton color="inherit">
              <Settings />
            </IconButton>
          </Tooltip>

          {/* Profil */}
          <Tooltip title="Profil">
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Tooltip>
          
          {/* Profil Menüsü */}
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            PaperProps={{
              sx: {
                mt: 1.5,
                minWidth: 200,
                borderRadius: 2,
                boxShadow: 3,
              }
            }}
          >
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <AccountCircle fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary={user?.name || 'Admin'} 
                secondary={user?.email || 'admin@lcwaikiki.com'}
              />
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Profil Ayarları" />
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Çıkış Yap" />
            </MenuItem>
          </Menu>

          {/* Bildirim Menüsü */}
          <Menu
            anchorEl={notificationAnchorEl}
            open={Boolean(notificationAnchorEl)}
            onClose={handleNotificationClose}
            PaperProps={{
              sx: {
                mt: 1.5,
                minWidth: 300,
                maxWidth: 350,
                borderRadius: 2,
                boxShadow: 3,
              }
            }}
          >
            <MenuItem sx={{ justifyContent: 'space-between' }}>
              <Typography variant="subtitle1" fontWeight="bold">Bildirimler</Typography>
              <Button size="small" color="primary">Tümünü Temizle</Button>
            </MenuItem>
            <Divider />
            {notifications.map((notification) => (
              <MenuItem key={notification.id} onClick={handleNotificationClose}>
                <ListItemText 
                  primary={notification.message}
                  secondary={notification.time}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontSize: '0.9rem',
                      fontWeight: notification.type === 'warning' ? 'bold' : 'normal',
                      color: notification.type === 'warning' ? 'error.main' : 'text.primary'
                    },
                    '& .MuiListItemText-secondary': {
                      fontSize: '0.8rem'
                    }
                  }}
                />
              </MenuItem>
            ))}
            <Divider />
            <MenuItem sx={{ justifyContent: 'center' }}>
              <Button size="small" color="primary">Tüm Bildirimleri Gör</Button>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AdminNavbar; 