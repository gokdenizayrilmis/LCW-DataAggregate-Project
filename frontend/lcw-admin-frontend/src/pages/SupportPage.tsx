import React from 'react';
import { Box, Typography, Card, CardContent, TextField, Stack, Button } from '@mui/material';
import AdminNavbar from '../components/AdminNavbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const SupportPage: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <AdminNavbar />
      <Box sx={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ flexGrow: 1, p: 2, mt: 8 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 2 }}>Yardım & Destek</Typography>
            <Card sx={{ maxWidth: 720, borderRadius: 2 }}>
              <CardContent>
                <Stack spacing={2}>
                  <TextField label="Konu" fullWidth />
                  <TextField label="Kategori" fullWidth />
                  <TextField label="Açıklama" fullWidth multiline minRows={4} />
                  <TextField label="Ekran Görüntüsü (URL)" fullWidth />
                  <Box>
                    <Button variant="contained">Dev'lere Gönder (Simülasyon)</Button>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Box>
          <Footer />
        </Box>
      </Box>
    </Box>
  );
};

export default SupportPage;
