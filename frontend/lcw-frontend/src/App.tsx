import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme
} from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  Store as StoreIcon,
  ShoppingCart as SalesIcon,
  AssignmentReturn as ReturnIcon,
  Inventory as InventoryIcon,
  People as PeopleIcon
} from '@mui/icons-material';

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
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        {/* AppBar */}
        <AppBar position="static">
          <Toolbar>
            <DashboardIcon sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              LCW Data Aggregate Dashboard
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Ana İçerik */}
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
            <Box sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, textAlign: 'center' }}>
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
      </Box>
    </ThemeProvider>
  );
}

export default App;
