import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Store as StoreIcon,
  Person as PersonIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';

interface Store {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  isActive: boolean;
}

interface User {
  id: number;
  username: string;
  name: string;
  surname: string;
  email: string;
  role: number;
  storeId: number | null;
  isActive: boolean;
}

const AdminPage: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openStoreDialog, setOpenStoreDialog] = useState(false);
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [storesResponse, usersResponse] = await Promise.all([
        fetch('http://localhost:5283/api/Store'),
        fetch('http://localhost:5283/api/User')
      ]);

      if (storesResponse.ok && usersResponse.ok) {
        const storesData = await storesResponse.json();
        const usersData = await usersResponse.json();
        setStores(storesData);
        setUsers(usersData);
      } else {
        setError('Veriler yüklenirken hata oluştu');
      }
    } catch (error) {
      setError('Bağlantı hatası');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStore = () => {
    setSelectedStore(null);
    setOpenStoreDialog(true);
  };

  const handleEditStore = (store: Store) => {
    setSelectedStore(store);
    setOpenStoreDialog(true);
  };

  const handleDeleteStore = async (storeId: number) => {
    if (window.confirm('Bu mağazayı silmek istediğinizden emin misiniz?')) {
      try {
        const response = await fetch(`http://localhost:5283/api/Store/${storeId}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchData();
        } else {
          setError('Mağaza silinirken hata oluştu');
        }
      } catch (error) {
        setError('Bağlantı hatası');
      }
    }
  };

  const handleSaveStore = async (storeData: Partial<Store>) => {
    try {
      const url = selectedStore 
        ? `http://localhost:5283/api/Store/${selectedStore.id}`
        : 'http://localhost:5283/api/Store';
      
      const method = selectedStore ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(storeData)
      });

      if (response.ok) {
        setOpenStoreDialog(false);
        fetchData();
      } else {
        setError('Mağaza kaydedilirken hata oluştu');
      }
    } catch (error) {
      setError('Bağlantı hatası');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography>Yükleniyor...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, color: '#1976d2' }}>
        Admin Paneli
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* İstatistik Kartları */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <StoreIcon sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {stores.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Toplam Mağaza
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <PersonIcon sx={{ fontSize: 40, color: '#4caf50', mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {users.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Toplam Kullanıcı
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <DashboardIcon sx={{ fontSize: 40, color: '#ff9800', mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {stores.filter(s => s.isActive).length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Aktif Mağaza
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <PersonIcon sx={{ fontSize: 40, color: '#f44336', mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {users.filter(u => u.isActive).length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Aktif Kullanıcı
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Mağaza Yönetimi */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Mağaza Yönetimi
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddStore}
              sx={{ borderRadius: 2 }}
            >
              Yeni Mağaza Ekle
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Mağaza Adı</TableCell>
                  <TableCell>Adres</TableCell>
                  <TableCell>Telefon</TableCell>
                  <TableCell>E-posta</TableCell>
                  <TableCell>Durum</TableCell>
                  <TableCell>İşlemler</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stores.map((store) => (
                  <TableRow key={store.id}>
                    <TableCell>{store.id}</TableCell>
                    <TableCell>{store.name}</TableCell>
                    <TableCell>{store.address}</TableCell>
                    <TableCell>{store.phone}</TableCell>
                    <TableCell>{store.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={store.isActive ? 'Aktif' : 'Pasif'}
                        color={store.isActive ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleEditStore(store)}
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteStore(store.id)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Kullanıcı Yönetimi */}
      <Card>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
            Kullanıcı Yönetimi
          </Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Kullanıcı Adı</TableCell>
                  <TableCell>Ad Soyad</TableCell>
                  <TableCell>E-posta</TableCell>
                  <TableCell>Rol</TableCell>
                  <TableCell>Mağaza ID</TableCell>
                  <TableCell>Durum</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{`${user.name} ${user.surname}`}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.role === 3 ? 'Admin' : user.role === 2 ? 'Manager' : 'User'}
                        color={user.role === 3 ? 'error' : user.role === 2 ? 'warning' : 'primary'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{user.storeId || '-'}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.isActive ? 'Aktif' : 'Pasif'}
                        color={user.isActive ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Mağaza Ekleme/Düzenleme Dialog */}
      <Dialog open={openStoreDialog} onClose={() => setOpenStoreDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedStore ? 'Mağaza Düzenle' : 'Yeni Mağaza Ekle'}
        </DialogTitle>
        <DialogContent>
          <StoreForm
            store={selectedStore}
            onSave={handleSaveStore}
            onCancel={() => setOpenStoreDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

// Mağaza Form Bileşeni
interface StoreFormProps {
  store: Store | null;
  onSave: (data: Partial<Store>) => void;
  onCancel: () => void;
}

const StoreForm: React.FC<StoreFormProps> = ({ store, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: store?.name || '',
    address: store?.address || '',
    phone: store?.phone || '',
    email: store?.email || '',
    isActive: store?.isActive ?? true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          fullWidth
          label="Mağaza Adı"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <TextField
          fullWidth
          label="Adres"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            label="Telefon"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          <TextField
            fullWidth
            label="E-posta"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </Box>
        <FormControl fullWidth>
          <InputLabel>Durum</InputLabel>
          <Select
            value={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.value as boolean })}
            label="Durum"
          >
            <MenuItem value="true">Aktif</MenuItem>
            <MenuItem value="false">Pasif</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <DialogActions sx={{ mt: 3 }}>
        <Button onClick={onCancel}>İptal</Button>
        <Button type="submit" variant="contained">
          {store ? 'Güncelle' : 'Ekle'}
        </Button>
      </DialogActions>
    </Box>
  );
};

export default AdminPage; 