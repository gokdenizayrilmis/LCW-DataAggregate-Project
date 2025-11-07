import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  IconButton,
  Tooltip,
  InputAdornment,
  Card,
  CardContent,
  Chip,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Store as StoreIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  People as PeopleIcon,
  Inventory as InventoryIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import { jwtDecode } from 'jwt-decode';
import AdminNavbar from '../components/AdminNavbar';
import Footer from '../components/Footer';

// Interfaces
interface Store {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  isActive: boolean;
  isDomestic: boolean;
  createdAt: string;
  updatedAt: string;
}

interface StoreFormState {
  name: string;
  address: string;
  phone: string;
  email: string;
  password?: string;
  isActive: boolean;
  isDomestic: boolean;
}

interface Employee {
  id: number;
  name: string;
  surname: string;
  position: string;
  salary: number;
  hireDate: string;
  email: string;
  phone: string;
  storeId: number;
}

interface Product {
  id: number;
  name: string;
  code: string;
  category: string;
  price: number;
  stockQuantity: number;
  storeId: number;
}

const AdminDashboard: React.FC = () => {
  // State management
  const [stores, setStores] = useState<Store[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Store dialog states
  const [openStoreDialog, setOpenStoreDialog] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [storeForm, setStoreForm] = useState<StoreFormState>({
    name: '',
    address: '',
    phone: '',
    email: '',
    password: '',
    isActive: true,
    isDomestic: true
  });

  // Snackbar state
  const [snackbar, setSnackbar] = useState<{ 
    open: boolean, 
    message: string, 
    severity: 'success' | 'error' | 'info' | 'warning' 
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const navigate = useNavigate();

  // Authentication check
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || decoded["role"];
      if (role !== 'admin') {
        navigate('/');
        return;
      }
      fetchData();
    } catch (error) {
      console.error('Token decode error:', error);
      navigate('/');
    }
  }, [navigate]);

  // Fetch all data
  const fetchData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token bulunamadı');
        return;
      }

      // Fetch stores
      const storesResponse = await fetch('http://localhost:5283/api/stores', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (storesResponse.ok) {
        const storesData = await storesResponse.json();
        setStores(storesData);
        console.log('✅ Stores loaded:', storesData.length);
      } else {
        setError('Mağazalar yüklenemedi');
        console.error('❌ Stores fetch failed:', storesResponse.status);
      }

      // Fetch employees
      try {
        const employeesResponse = await fetch('http://localhost:5283/api/Employee', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (employeesResponse.ok) {
          const employeesData = await employeesResponse.json();
          setEmployees(employeesData);
          console.log('✅ Employees loaded:', employeesData.length);
        }
      } catch (err) {
        console.warn('⚠️ Employees fetch failed:', err);
        setEmployees([]);
      }

      // Fetch products
      try {
        const productsResponse = await fetch('http://localhost:5283/api/Product', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          setProducts(productsData);
          console.log('✅ Products loaded:', productsData.length);
        }
      } catch (err) {
        console.warn('⚠️ Products fetch failed:', err);
        setProducts([]);
      }

    } catch (error) {
      console.error('❌ Fetch data error:', error);
      setError('Veri yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Store CRUD operations
  const handleAddStore = () => {
    setEditMode(false);
    setSelectedStore(null);
    setStoreForm({
      name: '',
      address: '',
      phone: '',
      email: '',
      password: '',
      isActive: true,
      isDomestic: true
    });
    setOpenStoreDialog(true);
  };

  const handleEditStore = (store: Store) => {
    setEditMode(true);
    setSelectedStore(store);
    setStoreForm({
      name: store.name,
      address: store.address,
      phone: store.phone,
      email: store.email,
      password: '',
      isActive: store.isActive,
      isDomestic: store.isDomestic
    });
    setOpenStoreDialog(true);
  };

  const handleDeleteStore = async (storeId: number) => {
    const store = stores.find(s => s.id === storeId);
    if (!store) return;

    if (!window.confirm(`"${store.name}" mağazasını silmek istediğinizden emin misiniz?\n\nBu işlem geri alınamaz ve mağazaya bağlı tüm veriler silinecektir.`)) {
      return;
    }

    const token = localStorage.getItem('token');
    try {
      console.log('🗑️ Deleting store:', storeId);
      
      const response = await fetch(`http://localhost:5283/api/stores/${storeId}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('🗑️ Delete response:', response.status, response.statusText);

      if (response.ok) {
        const result = await response.json().catch(() => ({}));
        setSnackbar({
          open: true,
          message: result.message || `"${store.name}" mağazası başarıyla silindi`,
          severity: 'success'
        });
        fetchData(); // Refresh data
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Bilinmeyen hata' }));
        setSnackbar({
          open: true,
          message: errorData.message || 'Mağaza silinirken bir hata oluştu',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('❌ Delete store error:', error);
      setSnackbar({
        open: true,
        message: 'Bağlantı hatası',
        severity: 'error'
      });
    }
  };

  const handleSaveStore = async () => {
    // Validation
    if (!storeForm.name.trim()) {
      setSnackbar({
        open: true,
        message: 'Mağaza adı gereklidir',
        severity: 'error'
      });
      return;
    }

    if (!storeForm.email.trim()) {
      setSnackbar({
        open: true,
        message: 'E-posta adresi gereklidir',
        severity: 'error'
      });
      return;
    }

    if (!editMode && !storeForm.password?.trim()) {
      setSnackbar({
        open: true,
        message: 'Şifre gereklidir',
        severity: 'error'
      });
      return;
    }

    const token = localStorage.getItem('token');
    const url = editMode
      ? `http://localhost:5283/api/stores/${selectedStore?.id}`
      : 'http://localhost:5283/api/stores';
    const method = editMode ? 'PUT' : 'POST';

    const body: any = { ...storeForm };
    if (editMode && !body.password) {
      delete body.password;
    }

    try {
      console.log('💾 Saving store:', { editMode, body });

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      console.log('💾 Save response:', response.status, response.statusText);

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Store saved:', result);
        
        setSnackbar({
          open: true,
          message: editMode ? 'Mağaza başarıyla güncellendi' : 'Mağaza başarıyla eklendi',
          severity: 'success'
        });
        setOpenStoreDialog(false);
        fetchData(); // Refresh data
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Bilinmeyen hata' }));
        console.error('❌ Save store error:', errorData);
        setSnackbar({
          open: true,
          message: errorData.message || 'Bir hata oluştu',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('❌ Save store error:', error);
      setSnackbar({
        open: true,
        message: 'İşlem sırasında bir hata oluştu',
        severity: 'error'
      });
    }
  };

  // Calculate statistics
  const stats = {
    totalStores: stores.length,
    activeStores: stores.filter(s => s.isActive).length,
    domesticStores: stores.filter(s => s.isDomestic).length,
    internationalStores: stores.filter(s => !s.isDomestic).length,
    totalEmployees: employees.length,
    totalProducts: products.length,
    totalStock: products.reduce((sum, p) => sum + p.stockQuantity, 0)
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Veriler yükleniyor...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      bgcolor: '#f5f5f5'
    }}>
      <AdminNavbar />
      
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8, mb: 5 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
            Yönetim Paneli
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Mağaza, çalışan ve ürün yönetimi
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Statistics Cards */}
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 3, 
          mb: 4,
          '& > *': {
            flex: '1 1 200px',
            minWidth: 200
          }
        }}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
            borderRadius: 3,
            boxShadow: 3,
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-4px)' }
          }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <StoreIcon sx={{ fontSize: 48, color: '#1976d2', mb: 2 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                {stats.totalStores}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Toplam Mağaza
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ 
            background: 'linear-gradient(135deg, #e8f5e8 0%, #f1f8e9 100%)',
            borderRadius: 3,
            boxShadow: 3,
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-4px)' }
          }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <PeopleIcon sx={{ fontSize: 48, color: '#4caf50', mb: 2 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                {stats.totalEmployees}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Toplam Çalışan
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ 
            background: 'linear-gradient(135deg, #fff3e0 0%, #fce4ec 100%)',
            borderRadius: 3,
            boxShadow: 3,
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-4px)' }
          }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <InventoryIcon sx={{ fontSize: 48, color: '#ff9800', mb: 2 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
                {stats.totalProducts}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Toplam Ürün
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ 
            background: 'linear-gradient(135deg, #f3e5f5 0%, #e1f5fe 100%)',
            borderRadius: 3,
            boxShadow: 3,
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-4px)' }
          }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <TrendingUpIcon sx={{ fontSize: 48, color: '#9c27b0', mb: 2 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#9c27b0' }}>
                {stats.totalStock}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Toplam Stok
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Store Management Section */}
        <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
              Mağaza Yönetimi
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddStore}
              sx={{
                background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                }
              }}
            >
              Yeni Mağaza
            </Button>
        </Box>

          <Divider sx={{ mb: 3 }} />

          {stores.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <StoreIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Henüz mağaza eklenmemiş
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                İlk mağazanızı ekleyerek başlayın
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddStore}
              >
                İlk Mağazayı Ekle
              </Button>
            </Box>
          ) : (
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 2,
              '& > *': {
                flex: '1 1 300px',
                minWidth: 300
              }
            }}>
              {stores.map((store) => (
                <Card key={store.id} sx={{ 
                  height: '100%',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': { 
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                  }
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <StoreIcon sx={{ color: 'primary.main', mr: 1 }} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {store.name}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="Düzenle">
                          <IconButton 
                            size="small"
                            onClick={() => handleEditStore(store)}
                            sx={{ color: '#2196f3' }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Sil">
                          <IconButton 
                            size="small"
                            onClick={() => handleDeleteStore(store.id)}
                            sx={{ color: '#f44336' }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocationIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          {store.address}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          {store.phone}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <EmailIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          {store.email}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip
                        label={store.isActive ? 'Aktif' : 'Pasif'}
                        color={store.isActive ? 'success' : 'default'}
                        size="small"
                      />
                      <Chip
                        label={store.isDomestic ? 'Yurt İçi' : 'Yurt Dışı'}
                        color={store.isDomestic ? 'primary' : 'secondary'}
                        size="small"
                      />
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Paper>

        {/* Quick Actions */}
        <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            Hızlı İşlemler
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              startIcon={<StoreIcon />}
              onClick={() => navigate('/stores')}
            >
              Tüm Mağazalar
            </Button>
            <Button
              variant="outlined"
              startIcon={<PeopleIcon />}
              onClick={() => navigate('/employees')}
            >
              Çalışanlar
            </Button>
            <Button
              variant="outlined"
              startIcon={<InventoryIcon />}
              onClick={() => navigate('/products')}
            >
              Ürünler
            </Button>
          </Box>
        </Paper>
      </Box>

      {/* Store Dialog */}
      <Dialog 
        open={openStoreDialog} 
        onClose={() => setOpenStoreDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: 24,
          }
        }}
      >
        <DialogTitle sx={{ 
          pb: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          color: '#1976d2',
          fontWeight: 'bold'
        }}>
          <StoreIcon />
          {editMode ? 'Mağaza Düzenle' : 'Yeni Mağaza Ekle'}
        </DialogTitle>
        
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Mağaza Adı"
              value={storeForm.name}
              onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })}
              fullWidth
              required
              placeholder="Örn: LCW İstanbul Avrupa"
            />
            
            <TextField
              label="Adres"
              value={storeForm.address}
              onChange={(e) => setStoreForm({ ...storeForm, address: e.target.value })}
              fullWidth
              multiline
              rows={2}
              placeholder="Mağaza adresini girin"
            />
            
            <TextField
              label="Telefon"
              value={storeForm.phone}
              onChange={(e) => setStoreForm({ ...storeForm, phone: e.target.value })}
              fullWidth
              placeholder="+90 212 555 0101"
            />
            
            <TextField
              label="E-posta"
              type="email"
              value={storeForm.email}
              onChange={(e) => setStoreForm({ ...storeForm, email: e.target.value })}
              fullWidth
              required
              placeholder="mağaza@lcwaikiki.com"
              helperText="Bu e-posta ile mağaza kullanıcısı girişi yapılabilir"
            />
            
            <TextField
              label="Şifre"
              type={showPassword ? 'text' : 'password'}
              value={storeForm.password}
              onChange={(e) => setStoreForm({ ...storeForm, password: e.target.value })}
              fullWidth
              required={!editMode}
              helperText={editMode ? 'Değiştirmek istemiyorsanız boş bırakın' : 'Mağaza kullanıcısı için şifre'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <FormControl fullWidth>
              <InputLabel>Durum</InputLabel>
              <Select
                value={storeForm.isActive ? "true" : "false"}
                onChange={(e) => setStoreForm({ ...storeForm, isActive: e.target.value === "true" })}
                label="Durum"
              >
                <MenuItem value="true">Aktif</MenuItem>
                <MenuItem value="false">Pasif</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel>Mağaza Türü</InputLabel>
              <Select
                value={storeForm.isDomestic ? "true" : "false"}
                onChange={(e) => setStoreForm({ ...storeForm, isDomestic: e.target.value === "true" })}
                label="Mağaza Türü"
              >
                <MenuItem value="true">Yurt İçi</MenuItem>
                <MenuItem value="false">Yurt Dışı</MenuItem>
              </Select>
            </FormControl>
            
            {!editMode && (
              <Alert severity="info" sx={{ mt: 1 }}>
                <Typography variant="body2">
                  <strong>Otomatik Veri Ekleme:</strong> Yeni mağaza oluşturulduğunda otomatik olarak:
                  <br />• 10 çalışan (Mağaza Müdürü, Müdür Yardımcısı, Kasiyerler, Stok Sorumlusu)
                  <br />• 30 ürün (5'er adet Tişört, Pantolon, Ayakkabı, Hırka, Gömlek, Şort)
                  <br />• Mağaza kullanıcı hesabı (e-posta ve şifre ile giriş yapılabilir)
                </Typography>
              </Alert>
            )}
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setOpenStoreDialog(false)}
            sx={{ color: 'text.secondary' }}
          >
            İptal
          </Button>
          <Button 
            onClick={handleSaveStore} 
            variant="contained"
            sx={{
              background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
              boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
              }
            }}
          >
            {editMode ? 'Güncelle' : 'Ekle'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Footer />
    </Box>
  );
};

export default AdminDashboard;