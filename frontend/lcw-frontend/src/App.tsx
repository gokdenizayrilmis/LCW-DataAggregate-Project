import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Button
} from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  Store as StoreIcon,
  ShoppingCart as SalesIcon,
  AssignmentReturn as ReturnIcon,
  Inventory as InventoryIcon,
  People as PeopleIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import StoresPage from './pages/StorePage';

// Material-UI tema oluşturma
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'stores'>('dashboard');

  const handleStoreClick = () => {
    console.log('Mağazalar kartına tıklandı!');
    setCurrentPage('stores');
  };

  const handleBackToDashboard = () => {
    setCurrentPage('dashboard');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        {/* AppBar */}
        <AppBar position="static">
          <Toolbar>
            {currentPage !== 'dashboard' && (
              <Button 
                color="inherit" 
                startIcon={<ArrowBackIcon />}
                onClick={handleBackToDashboard}
                sx={{ mr: 2 }}
              >
                Geri
              </Button>
            )}
            <DashboardIcon sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              LCW Data Aggregate Dashboard
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Sayfa İçeriği */}
        {currentPage === 'dashboard' ? (
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Hoş Geldiniz! 🎉
            </Typography>
            
            <Typography variant="body1" color="text.secondary" paragraph>
              LCW Data Aggregate sistemine hoş geldiniz. Bu dashboard ile mağaza verilerinizi 
              yönetebilir, satış ve iade işlemlerinizi takip edebilirsiniz.
            </Typography>

            {/* Hızlı Erişim Kartları */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3, mt: 4 }}>
              <Box 
                sx={{ 
                  p: 3, 
                  border: '1px solid #e0e0e0', 
                  borderRadius: 2, 
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: '#f5f5f5' }
                }}
                onClick={handleStoreClick}
              >
                <StoreIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>Mağazalar</Typography>
                <Typography variant="body2" color="text.secondary">
                  Mağaza yönetimi ve bilgileri
                </Typography>
              </Box>

              <Box sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, textAlign: 'center' }}>
                <SalesIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>Satışlar</Typography>
                <Typography variant="body2" color="text.secondary">
                  Satış işlemleri ve raporları
                </Typography>
              </Box>

              <Box sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, textAlign: 'center' }}>
                <ReturnIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>İadeler</Typography>
                <Typography variant="body2" color="text.secondary">
                  İade işlemleri ve analizleri
                </Typography>
              </Box>

              <Box sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, textAlign: 'center' }}>
                <InventoryIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>Stok</Typography>
                <Typography variant="body2" color="text.secondary">
                  Stok yönetimi ve takibi
                </Typography>
              </Box>

              <Box sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, textAlign: 'center' }}>
                <PeopleIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>Kullanıcılar</Typography>
                <Typography variant="body2" color="text.secondary">
                  Kullanıcı yönetimi
                </Typography>
              </Box>
            </Box>
          </Container>
        ) : (
          <StoresPage />
        )}
      </Box>
    </ThemeProvider>
  );
}

export default App;
