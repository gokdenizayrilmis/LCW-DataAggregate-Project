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
        <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Box sx={{ flexGrow: 1, p: 3, mt: 8, mr: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 2 }}>Mağazalar</Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
              {stores.map((s) => (
                <Card 
                  key={s.id} 
                  sx={{ 
                    borderRadius: 3, 
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'space-between',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    border: '1px solid rgba(25, 118, 210, 0.1)',
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8fbff 100%)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: s.isActive 
                        ? 'linear-gradient(90deg, #4caf50 0%, #66bb6a 100%)' 
                        : 'linear-gradient(90deg, #9e9e9e 0%, #bdbdbd 100%)',
                      transition: 'all 0.3s ease'
                    },
                    '&:hover': {
                      transform: 'translateY(-8px) scale(1.02)',
                      boxShadow: '0 12px 40px rgba(25, 118, 210, 0.2)',
                      border: '1px solid rgba(25, 118, 210, 0.3)',
                      '&::before': {
                        height: '6px'
                      }
                    }
                  }}
                >
                  <CardContent sx={{ pb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 700, 
                          color: '#1976d2',
                          fontSize: '1.1rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}
                      >
                        🏪 {s.name}
                      </Typography>
                    </Box>
                    
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        mb: 2, 
                        minHeight: '40px',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: 1.6
                      }}
                    >
                      📍 {s.address?.length > 80 ? s.address.substring(0, 80) + '…' : s.address}
                    </Typography>
                    
                    <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                      <Chip 
                        label={s.isActive ? 'Aktif' : 'Pasif'} 
                        color={s.isActive ? 'success' : 'default'} 
                        size="small" 
                        sx={{ 
                          fontWeight: 600,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'scale(1.05)'
                          }
                        }}
                      />
                      <Chip 
                        label={s.isDomestic ? 'Yurt İçi' : 'Yurt Dışı'} 
                        color={s.isDomestic ? 'primary' : 'secondary'} 
                        size="small"
                        sx={{ 
                          fontWeight: 600,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'scale(1.05)'
                          }
                        }}
                      />
                    </Stack>
                    
                    <Box sx={{ 
                      bgcolor: '#f8fafc', 
                      borderRadius: 2, 
                      p: 1.5,
                      border: '1px solid #e3f2fd'
                    }}>
                      <Typography variant="body2" sx={{ mb: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span style={{ fontWeight: 600, color: '#1976d2' }}>📧</span> {s.email}
                      </Typography>
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span style={{ fontWeight: 600, color: '#1976d2' }}>📱</span> {s.phone}
                      </Typography>
                    </Box>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2, pt: 0 }}>
                    <Button 
                      size="small" 
                      color="error" 
                      variant="outlined" 
                      startIcon={<Delete />} 
                      onClick={() => handleDelete(s)}
                      sx={{
                        borderRadius: 2,
                        fontWeight: 600,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          boxShadow: '0 4px 12px rgba(244, 67, 54, 0.3)'
                        }
                      }}
                    >
                      Sil
                    </Button>
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
