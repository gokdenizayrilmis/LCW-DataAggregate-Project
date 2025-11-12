import React, { useState } from 'react';
import { Box, Typography, TextField, Stack, FormControlLabel, Switch, Button, Alert, CircularProgress, Card, CardContent, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import { ContentCopy as CopyIcon, CheckCircle as CheckIcon } from '@mui/icons-material';
import AdminNavbar from '../components/AdminNavbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

interface StoreResponse {
  id: number;
  name: string;
  email: string;
  userEmail?: string;
  tempPassword?: string;
}

const StoreManagementPage: React.FC = () => {
  const [form, setForm] = useState({ name: '', address: '', email: '', password: '', phone: '', isActive: true, isDomestic: true });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [createdStore, setCreatedStore] = useState<StoreResponse | null>(null);
  const [showCredentialsDialog, setShowCredentialsDialog] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

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
      
      const responseData: StoreResponse = await res.json();
      setCreatedStore(responseData);
      setShowCredentialsDialog(true);
      setSuccess('Mağaza başarıyla eklendi ve kullanıcı oluşturuldu.');
      setForm({ name: '', address: '', email: '', password: '', phone: '', isActive: true, isDomestic: true });
    } catch (e: any) {
      setError(e.message || 'Hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const closeDialog = () => {
    setShowCredentialsDialog(false);
    setCreatedStore(null);
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

      {/* Credentials Dialog - Kullanıcı Bilgileri */}
      <Dialog 
        open={showCredentialsDialog} 
        onClose={closeDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: '#1976d2', color: 'white', fontWeight: 700 }}>
          ✅ Mağaza Başarıyla Oluşturuldu!
        </DialogTitle>
        <DialogContent sx={{ mt: 3 }}>
          <Alert severity="success" sx={{ mb: 3 }}>
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
              {createdStore?.name} mağazası için kullanıcı hesabı oluşturuldu.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Aşağıdaki bilgileri not alın ve mağaza yetkilisine iletin. Bu bilgilerle user panelinden giriş yapılabilir.
            </Typography>
          </Alert>

          <Card sx={{ mb: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                E-posta (Kullanıcı Adı)
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextField
                  value={createdStore?.userEmail || createdStore?.email || ''}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                    sx: { fontWeight: 600, bgcolor: 'white' }
                  }}
                />
                <IconButton 
                  onClick={() => copyToClipboard(createdStore?.userEmail || createdStore?.email || '', 'email')}
                  color={copiedField === 'email' ? 'success' : 'primary'}
                >
                  {copiedField === 'email' ? <CheckIcon /> : <CopyIcon />}
                </IconButton>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ mb: 2, bgcolor: '#fff3e0', borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Şifre
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextField
                  value={createdStore?.tempPassword || ''}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                    sx: { fontWeight: 600, bgcolor: 'white', fontFamily: 'monospace' }
                  }}
                />
                <IconButton 
                  onClick={() => copyToClipboard(createdStore?.tempPassword || '', 'password')}
                  color={copiedField === 'password' ? 'success' : 'primary'}
                >
                  {copiedField === 'password' ? <CheckIcon /> : <CopyIcon />}
                </IconButton>
              </Box>
            </CardContent>
          </Card>

          <Alert severity="warning" sx={{ mt: 2 }}>
            <Typography variant="body2">
              ⚠️ Bu şifre sadece bir kez gösterilmektedir. Lütfen güvenli bir yere kaydedin.
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={closeDialog} variant="contained" fullWidth>
            Anladım, Kapat
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StoreManagementPage;
