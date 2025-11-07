import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  Card,
  CardContent,
  CardActions,
  Tooltip,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Search as SearchIcon,
  Store as StoreIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  ViewModule as ViewModuleIcon,
  ViewList as ViewListIcon,
} from '@mui/icons-material';
import AdminNavbar from '../components/AdminNavbar';
import Footer from '../components/Footer';

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

const StoreListPage: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openStoreDialog, setOpenStoreDialog] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [storeForm, setStoreForm] = useState<StoreFormState>({
    name: '',
    address: '',
    phone: '',
    email: '',
    password: '',
    isActive: true,
    isDomestic: true
  });
  const [snackbar, setSnackbar] = useState<{ open: boolean, message: string, severity: 'success' | 'error' | 'info' | 'warning' }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5283/api/stores', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setStores(data);
      } else {
        setError('Mağaza verileri yüklenirken hata oluştu');
      }
    } catch (error) {
      setError('Bağlantı hatası');
    } finally {
      setLoading(false);
    }
  };

  const handleViewStore = (store: Store) => {
    navigate(`/store/${store.id}`);
  };

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
      ...store,
      password: ''
    });
    setOpenStoreDialog(true);
  };

  const handleDeleteStore = async (storeId: number) => {
    if (window.confirm('Bu mağazayı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`http://localhost:5283/api/stores/${storeId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          setSnackbar({
            open: true,
            message: 'Mağaza başarıyla silindi',
            severity: 'success'
          });
          fetchStores();
        } else {
          setSnackbar({
            open: true,
            message: 'Mağaza silinirken bir hata oluştu',
            severity: 'error'
          });
        }
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Bağlantı hatası',
          severity: 'error'
        });
      }
    }
  };

  const handleSaveStore = async () => {
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
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        setSnackbar({
          open: true,
          message: editMode ? 'Mağaza başarıyla güncellendi' : 'Mağaza başarıyla eklendi',
          severity: 'success'
        });
        setOpenStoreDialog(false);
        fetchStores();
      } else {
        const errorData = await response.json();
        setSnackbar({
          open: true,
          message: errorData.message || 'Bir hata oluştu',
          severity: 'error'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'İşlem sırasında bir hata oluştu',
        severity: 'error'
      });
    }
  };

  const handleFixProductCodes = async () => {
    if (!window.confirm('Ürün kodlarını düzeltmek istediğinizden emin misiniz?\n\nBu işlem yanlış formatlı ürün kodlarını (T07001 -> T1001) düzeltecektir.')) {
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5283/api/stores/fix-product-codes', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        setSnackbar({
          open: true,
          message: `${result.message} (${result.fixedCount} ürün düzeltildi)`,
          severity: 'success'
        });
      } else {
        const errorData = await response.json();
        setSnackbar({
          open: true,
          message: errorData.message || 'Ürün kodları düzeltilirken bir hata oluştu',
          severity: 'error'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Bağlantı hatası',
        severity: 'error'
      });
    }
  };

  const handleForceDeleteStore = async (storeId: number) => {
    if (!window.confirm('⚠️ DİKKAT! Bu işlem mağazayı ve tüm bağlı kayıtları zorla silecektir!\n\nBu işlem geri alınamaz. Devam etmek istiyor musunuz?')) {
      return;
    }

    const token = localStorage.getItem('token');
    console.log('🔍 Force Delete Debug:', { storeId, token: token ? 'Token exists' : 'No token' });
    
    try {
      const response = await fetch(`http://localhost:5283/api/stores/force-delete/${storeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('🔍 Response Status:', response.status, response.statusText);
      
      if (response.ok) {
        const result = await response.json();
        console.log('🔍 Success Result:', result);
        setSnackbar({
          open: true,
          message: `${result.message}`,
          severity: 'success'
        });
        fetchStores(); // Listeyi yenile
      } else {
        const errorData = await response.json();
        console.log('🔍 Error Response:', errorData);
        setSnackbar({
          open: true,
          message: errorData.message || 'Mağaza zorla silinirken bir hata oluştu',
          severity: 'error'
        });
      }
    } catch (error) {
      console.log('🔍 Catch Error:', error);
      setSnackbar({
        open: true,
        message: 'Bağlantı hatası',
        severity: 'error'
      });
    }
  };

  const handleClearAllStores = async () => {
    const confirmMessage = `⚠️ DİKKAT! Bu işlem geri alınamaz!\n\n` +
      `Veritabanındaki TÜM mağazaları (${stores.length} adet) ve bunlara bağlı:\n` +
      `• Tüm çalışanlar\n` +
      `• Tüm ürünler\n` +
      `• Tüm kullanıcı hesapları\n` +
      `• Tüm stok kayıtları\n\n` +
      `sileceksiniz. Bu işlemi gerçekten yapmak istiyor musunuz?`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    // İkinci onay
    const finalConfirm = window.confirm(`🚨 SON UYARI!\n\n` +
      `"EVET" yazmanız gerekiyor. Bu işlem gerçekten geri alınamaz!\n\n` +
      `Onaylamak için "EVET" yazın:`);

    if (finalConfirm) {
      const userInput = prompt('Onaylamak için "EVET" yazın:');
      if (userInput !== 'EVET') {
        setSnackbar({
          open: true,
          message: 'İşlem iptal edildi',
          severity: 'info'
        });
        return;
      }
    } else {
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5283/api/stores/clear-all', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        setSnackbar({
          open: true,
          message: `${result.message} (${result.deletedCount} mağaza silindi)`,
          severity: 'success'
        });
        fetchStores(); // Listeyi yenile
      } else {
        const errorData = await response.json();
        setSnackbar({
          open: true,
          message: errorData.message || 'Mağazalar silinirken bir hata oluştu',
          severity: 'error'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Bağlantı hatası',
        severity: 'error'
      });
    }
  };

  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <AdminNavbar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8, mb: 5 }}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
              Mağaza Listesi
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Tüm mağazaları görüntüle, düzenle ve yönet
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
             <Button
               variant="contained"
               startIcon={<AddIcon />}
               onClick={handleAddStore}
               sx={{ 
                 height: 'fit-content',
                 background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                 boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)',
                 '&:hover': {
                   background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                 }
               }}
             >
               Yeni Mağaza Ekle
             </Button>
             
             <Button
               variant="outlined"
               color="warning"
               onClick={handleFixProductCodes}
               sx={{ 
                 height: 'fit-content',
                 borderColor: '#ff9800',
                 color: '#ff9800',
                 '&:hover': {
                   borderColor: '#f57c00',
                   backgroundColor: 'rgba(255, 152, 0, 0.04)',
                 }
               }}
             >
               Ürün Kodlarını Düzelt
             </Button>
             
             {stores.length > 0 && (
               <Button
                 variant="outlined"
                 color="error"
                 onClick={handleClearAllStores}
                 sx={{ 
                   height: 'fit-content',
                   borderColor: '#f44336',
                   color: '#f44336',
                   '&:hover': {
                     borderColor: '#d32f2f',
                     backgroundColor: 'rgba(244, 67, 54, 0.04)',
                   }
                 }}
               >
                 Tüm Mağazaları Sil ({stores.length})
               </Button>
             )}
           </Box>
        </Box>

        {/* Arama Kutusu ve Görünüm Seçenekleri */}
        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 3, flex: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Mağaza ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ bgcolor: 'white' }}
            />
          </Paper>
          <Paper sx={{ p: 1, borderRadius: 2, boxShadow: 3, display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Grid Görünümü">
              <IconButton 
                color={viewMode === 'grid' ? 'primary' : 'default'}
                onClick={() => setViewMode('grid')}
              >
                <ViewModuleIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Liste Görünümü">
              <IconButton 
                color={viewMode === 'list' ? 'primary' : 'default'}
                onClick={() => setViewMode('list')}
              >
                <ViewListIcon />
              </IconButton>
            </Tooltip>
          </Paper>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {/* Mağaza Kartları veya Liste */}
        {viewMode === 'grid' ? (
          <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' } }}>
          {filteredStores.map((store) => (
            <Box key={store.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 2,
                  boxShadow: 3,
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <StoreIcon sx={{ color: '#1976d2', mr: 1, fontSize: 28 }} />
                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                      {store.name}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
                    <Typography variant="body2" color="text.secondary">
                      {store.address}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <PhoneIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
                    <Typography variant="body2" color="text.secondary">
                      {store.phone}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <EmailIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
                    <Typography variant="body2" color="text.secondary">
                      {store.email}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip
                      label={store.isActive ? 'Aktif' : 'Pasif'}
                      color={store.isActive ? 'success' : 'error'}
                      size="small"
                      sx={{ fontWeight: 'bold' }}
                    />
                    <Chip
                      label={store.isDomestic ? 'Yurt İçi' : 'Yurt Dışı'}
                      color={store.isDomestic ? 'primary' : 'secondary'}
                      size="small"
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Box>
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Tooltip title="Görüntüle">
                    <IconButton 
                      onClick={() => handleViewStore(store)}
                      sx={{ 
                        color: '#1976d2',
                        '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.04)' }
                      }}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Düzenle">
                    <IconButton 
                      onClick={() => handleEditStore(store)}
                      sx={{ 
                        color: '#2196f3',
                        '&:hover': { backgroundColor: 'rgba(33, 150, 243, 0.04)' }
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Sil">
                    <IconButton 
                      onClick={() => handleDeleteStore(store.id)}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        if (window.confirm('⚠️ ZORLA SİLME\n\nNormal silme işlemi başarısız olduysa, zorla silme yapmak istiyor musunuz?\n\nBu işlem foreign key kontrolünü devre dışı bırakarak tüm bağlı kayıtları silecektir.')) {
                          handleForceDeleteStore(store.id);
                        }
                      }}
                      sx={{ 
                        color: '#f44336',
                        '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.04)' }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Box>
          ))}
          </Box>
        ) : (
          <Paper sx={{ borderRadius: 2, boxShadow: 3, overflow: 'hidden' }}>
            <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
              {filteredStores.map((store) => (
                <Box
                  key={store.id}
                  sx={{
                    p: 2,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  <StoreIcon sx={{ color: 'primary.main', fontSize: 28 }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {store.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {store.address}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      label={store.isActive ? 'Aktif' : 'Pasif'}
                      color={store.isActive ? 'success' : 'error'}
                      size="small"
                      sx={{ fontWeight: 'bold' }}
                    />
                    <Chip
                      label={store.isDomestic ? 'Yurt İçi' : 'Yurt Dışı'}
                      color={store.isDomestic ? 'primary' : 'secondary'}
                      size="small"
                      sx={{ fontWeight: 'bold' }}
                    />
                    <Tooltip title="Görüntüle">
                      <IconButton onClick={() => handleViewStore(store)} color="info">
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Düzenle">
                      <IconButton onClick={() => handleEditStore(store)} color="primary">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Sil">
                      <IconButton 
                        onClick={() => handleDeleteStore(store.id)}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          if (window.confirm('⚠️ ZORLA SİLME\n\nNormal silme işlemi başarısız olduysa, zorla silme yapmak istiyor musunuz?\n\nBu işlem foreign key kontrolünü devre dışı bırakarak tüm bağlı kayıtları silecektir.')) {
                            handleForceDeleteStore(store.id);
                          }
                        }}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        )}

        {/* Mağaza Ekleme/Düzenleme Dialog */}
        <Dialog 
          open={openStoreDialog} 
          onClose={() => setOpenStoreDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
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
              />
              <TextField
                label="Adres"
                value={storeForm.address}
                onChange={(e) => setStoreForm({ ...storeForm, address: e.target.value })}
                fullWidth
                multiline
                rows={2}
              />
              <TextField
                label="Telefon"
                value={storeForm.phone}
                onChange={(e) => setStoreForm({ ...storeForm, phone: e.target.value })}
                fullWidth
              />
              <TextField
                label="E-posta"
                type="email"
                value={storeForm.email}
                onChange={(e) => setStoreForm({ ...storeForm, email: e.target.value })}
                fullWidth
                required
                helperText="Bu e-posta ile mağaza kullanıcısı girişi yapılabilir"
              />
              <TextField
                label="Şifre"
                type={showPassword ? 'text' : 'password'}
                value={storeForm.password}
                onChange={(e) => setStoreForm({ ...storeForm, password: e.target.value })}
                fullWidth
                required={!editMode}
                helperText={editMode ? 'Değiştirmek istemiyorsanız boş bırakın' : ''}
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
              
              {/* Otomatik veri ekleme bilgisi kaldırıldı; veriler mağaza tarafından manuel girilecek */}
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
      </Box>
      <Footer />
    </Box>
  );
};

export default StoreListPage;