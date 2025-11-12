import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, CardActions, Button, Chip, Stack, Dialog, DialogTitle, DialogContent, DialogActions, Alert, CircularProgress } from '@mui/material';
import { Delete } from '@mui/icons-material';
import AdminNavbar from '../components/AdminNavbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

interface StoreItem {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  isActive: boolean;
  isDomestic: boolean;
  createdAt: string;
}

const StoresPage: React.FC = () => {
  const [stores, setStores] = useState<StoreItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [storeToDelete, setStoreToDelete] = useState<StoreItem | null>(null);

  const token = localStorage.getItem('token');

  const fetchStores = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5283/api/stores', { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error('Mağazalar yüklenemedi');
      const data = await res.json();
      setStores(data);
    } catch (e: any) {
      setError(e.message || 'Hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStores(); }, []);

  const handleDelete = (item: StoreItem) => {
    setStoreToDelete(item);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!storeToDelete) return;
    try {
      const res = await fetch(`http://localhost:5283/api/stores/${storeToDelete.id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error('Silme işlemi başarısız');
      await fetchStores();
    } catch (e: any) {
      alert(e.message || 'Silme işleminde hata');
    } finally {
      setDeleteConfirmOpen(false);
      setStoreToDelete(null);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>Yükleniyor…</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <AdminNavbar />
      <Box sx={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ flexGrow: 1, p: 2, mt: 8 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 2 }}>Mağazalar</Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
              {stores.map((s) => (
                <Card key={s.id} sx={{ borderRadius: 2, boxShadow: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>{s.name}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {s.address?.length > 80 ? s.address.substring(0, 80) + '…' : s.address}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                      <Chip label={s.isActive ? 'Aktif' : 'Pasif'} color={s.isActive ? 'success' : 'default'} size="small" />
                      <Chip label={s.isDomestic ? 'Yurt İçi' : 'Yurt Dışı'} color={s.isDomestic ? 'primary' : 'secondary'} size="small" />
                    </Stack>
                    <Typography variant="body2"><b>E-posta:</b> {s.email}</Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}><b>Telefon:</b> {s.phone}</Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
                    <Button size="small" color="error" variant="outlined" startIcon={<Delete />} onClick={() => handleDelete(s)}>Sil</Button>
                  </CardActions>
                </Card>
              ))}
            </Box>
          </Box>
          <Footer />
        </Box>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Mağazayı Sil</DialogTitle>
        <DialogContent>
          <Typography>
            {storeToDelete && `"${storeToDelete.name}"`} adlı mağazayı kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>İptal</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Sil
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StoresPage;
