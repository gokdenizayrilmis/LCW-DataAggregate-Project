import React, { useEffect, useState } from 'react';
import { Box, Typography, Alert, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow, IconButton, Tooltip, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar } from '@mui/material';
import { Visibility, VisibilityOff, Edit, LockReset, ContentCopy } from '@mui/icons-material';
import AdminNavbar from '../components/AdminNavbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

interface UserItem {
  id: number;
  name: string;
  surname: string;
  email: string;
  storeId?: number;
  storeName?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [visible, setVisible] = useState<Record<number, boolean>>({});
  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState<UserItem | null>(null);
  const [form, setForm] = useState({ name: '', surname: '', email: '' });
  const [resetInfo, setResetInfo] = useState<{ open: boolean; password: string }>({ open: false, password: '' });

  const fetchUsers = async () => {
    setLoading(true); setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5283/api/User', { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error('Kullanıcılar yüklenemedi');
      const data = await res.json();
      setUsers(data);
    } catch (e: any) {
      setError(e.message || 'Hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const openEdit = (u: UserItem) => {
    setSelected(u);
    setForm({ name: u.name, surname: u.surname, email: u.email });
    setEditOpen(true);
  };

  const submitEdit = async () => {
    if (!selected) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5283/api/User/${selected.id}` , {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Güncelleme başarısız');
      setEditOpen(false); setSelected(null);
      await fetchUsers();
    } catch (e: any) {
      alert(e.message || 'Güncelleme hatası');
    }
  };

  const resetPassword = async (userId: number) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5283/api/User/${userId}/reset-password`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Şifre sıfırlanamadı');
      const data = await res.json();
      setResetInfo({ open: true, password: data.temporaryPassword });
    } catch (e: any) {
      alert(e.message || 'Şifre sıfırlama hatası');
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
          <Box sx={{ flexGrow: 1, p: 3, mt: 8, mr: 2, overflowX: 'auto' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 2 }}>Kullanıcılar</Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            
            <Box sx={{ overflowX: 'auto', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', borderRadius: 2 }}>
              <Table size="small" sx={{ background: 'white', minWidth: 900 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f8fafc' }}>
                    <TableCell sx={{ fontWeight: 700, color: '#1976d2' }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#1976d2' }}>Şifre</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#1976d2' }}>Rol</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#1976d2' }}>Mağaza</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#1976d2' }}>Oluşturma</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: '#1976d2' }}>İşlemler</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id} hover sx={{ '&:hover': { bgcolor: '#f8fbff' } }}>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>
                        {visible[u.id] ? 'Güvenlik nedeniyle gösterilemiyor' : '••••••'}
                        <Tooltip title={visible[u.id] ? 'Gizle' : 'Göster'}>
                          <IconButton size="small" onClick={() => setVisible((prev) => ({ ...prev, [u.id]: !prev[u.id] }))} sx={{ ml: 1 }}>
                            {visible[u.id] ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                      <TableCell>{u.storeId ? 'user' : 'admin'}</TableCell>
                      <TableCell>{u.storeName || '-'}</TableCell>
                      <TableCell>{new Date(u.createdAt).toLocaleDateString('tr-TR')}</TableCell>
                      <TableCell align="right">
                        <Button 
                          size="small" 
                          sx={{ 
                            mr: 1,
                            borderRadius: 2,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.05)'
                            }
                          }} 
                          variant="outlined" 
                          startIcon={<Edit />} 
                          onClick={() => openEdit(u)}
                        >
                          Düzenle
                        </Button>
                        <Button 
                          size="small" 
                          color="warning" 
                          variant="outlined" 
                          startIcon={<LockReset />} 
                          onClick={() => resetPassword(u.id)}
                          sx={{
                            borderRadius: 2,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.05)'
                            }
                          }}
                        >
                          Şifre Sıfırla
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Box>
          <Footer />
        </Box>
      </Box>

      {/* Dialogs */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Kullanıcı Düzenle</DialogTitle>
        <DialogContent dividers>
          <TextField label="Ad" fullWidth sx={{ mt: 1 }} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <TextField label="Soyad" fullWidth sx={{ mt: 2 }} value={form.surname} onChange={(e) => setForm({ ...form, surname: e.target.value })} />
          <TextField label="E-posta" fullWidth sx={{ mt: 2 }} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>İptal</Button>
          <Button variant="contained" onClick={submitEdit}>Kaydet</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={resetInfo.open} onClose={() => setResetInfo({ open: false, password: '' })} maxWidth="xs" fullWidth>
        <DialogTitle>Geçici Şifre Oluşturuldu</DialogTitle>
        <DialogContent dividers>
          <Typography>Yeni geçici şifre:</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1, p: 1.5, border: '1px solid #eee', borderRadius: 1 }}>
            <Typography sx={{ fontFamily: 'monospace', fontWeight: 700 }}>{resetInfo.password}</Typography>
            <Tooltip title="Kopyala">
              <IconButton onClick={() => navigator.clipboard.writeText(resetInfo.password)}>
                <ContentCopy fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Bu şifre kullanıcıya iletilmeli; kullanıcı ilk girişte değiştirebilir.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetInfo({ open: false, password: '' })}>Kapat</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersPage;
