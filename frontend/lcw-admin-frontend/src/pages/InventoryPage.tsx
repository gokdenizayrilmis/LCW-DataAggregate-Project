import React from 'react';
import { Box, Typography } from '@mui/material';
import AdminNavbar from '../components/AdminNavbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const InventoryPage: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <AdminNavbar />
      <Box sx={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ flexGrow: 1, p: 2, mt: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h5" color="text.secondary">Envanter geliştiriliyor…</Typography>
          </Box>
          <Footer />
        </Box>
      </Box>
    </Box>
  );
};

export default InventoryPage;
