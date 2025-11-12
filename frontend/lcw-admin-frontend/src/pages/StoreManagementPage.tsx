import React, { useState } from 'react';
import { Box, Typography, TextField, Stack, FormControlLabel, Switch, Button, Alert, CircularProgress, Card, CardContent } from '@mui/material';
import AdminNavbar from '../components/AdminNavbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const StoreManagementPage: React.FC = () => {
  const [form, setForm] = useState({ name: '', address: '', email: '', password: '', phone: '', isActive: true, isDomestic: true });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const submit = async () => {
    setError(''); setSuccess('');
    if (!form.name || !form.address || !form.email || !form.password || !form.phone) {
      setError('Lütfen tüm zorunlu alanları doldurun.');
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5283/api/stores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Mağaza eklenemedi');
      setSuccess('Mağaza başarıyla eklendi ve kullanıcı oluşturuldu.');
      setForm({ name: '', address: '', email: '', password: '', phone: '', isActive: true, isDomestic: true });
    } catch (e: any) {
      setError(e.message || 'Hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <AdminNavbar />
      <Box sx={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ flexGrow: 1, p: 2, mt: 8 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 2 }}>Mağaza Yönetimi</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>Yeni mağaza ve kullanıcı kaydı</Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

            <Card sx={{ maxWidth: 720, borderRadius: 2 }}>
              <CardContent>
                <Stack spacing={2}>
                  <TextField label="Mağaza Adı" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} fullWidth required />
                  <TextField label="Adres" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} fullWidth required />
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField label="E-posta" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} fullWidth required />
                    <TextField label="Telefon" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} fullWidth required />
                  </Stack>
                  <TextField label="Şifre" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} fullWidth required />
                  <Stack direction="row" spacing={2}>
                    <FormControlLabel control={<Switch checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />} label="Aktif" />
                    <FormControlLabel control={<Switch checked={form.isDomestic} onChange={(e) => setForm({ ...form, isDomestic: e.target.checked })} />} label="Yurt İçi" />
                  </Stack>
                  <Box>
                    <Button variant="contained" onClick={submit} disabled={loading}>
                      {loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Kaydet'}
                    </Button>
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

export default StoreManagementPage;
