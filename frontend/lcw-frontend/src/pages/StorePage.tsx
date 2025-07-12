import React, { useState, useEffect } from 'react';
import {
  Typography,
  Button,
  Box,
  Alert,
  Snackbar,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Fab,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StoreIcon from '@mui/icons-material/Store';
import StoreList from '../components/StoreList';
import StoreForm from '../components/StoreForm';
import { storeApi } from '../services/api';
import { Store, CreateStoreRequest, UpdateStoreRequest } from '../types';

const StorePage: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [alert, setAlert] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const fetchStores = async () => {
    try {
      setLoading(true);
      const data = await storeApi.getAll();
      setStores(data);
    } catch (error) {
      showAlert('Mağazalar yüklenirken hata oluştu', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const showAlert = (message: string, severity: 'success' | 'error') => {
    setAlert({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  const handleAddStore = () => {
    setEditingStore(null);
    setIsEditing(false);
    setFormOpen(true);
  };

  const handleEditStore = (store: Store) => {
    setEditingStore(store);
    setIsEditing(true);
    setFormOpen(true);
  };

  const handleDeleteStore = async (id: number) => {
    if (window.confirm('Bu mağazayı silmek istediğinizden emin misiniz?')) {
      try {
        await storeApi.delete(id);
        setStores(stores.filter(store => store.id !== id));
        showAlert('Mağaza başarıyla silindi', 'success');
      } catch (error) {
        showAlert('Mağaza silinirken hata oluştu', 'error');
      }
    }
  };

  const handleSubmitForm = async (data: CreateStoreRequest | UpdateStoreRequest) => {
    try {
      if (isEditing && editingStore) {
        const updatedStore = await storeApi.update(editingStore.id, data as UpdateStoreRequest);
        setStores(stores.map(store => 
          store.id === editingStore.id ? updatedStore : store
        ));
        showAlert('Mağaza başarıyla güncellendi', 'success');
      } else {
        const newStore = await storeApi.create(data as CreateStoreRequest);
        setStores([...stores, newStore]);
        showAlert('Mağaza başarıyla eklendi', 'success');
      }
    } catch (error) {
      showAlert(
        isEditing ? 'Mağaza güncellenirken hata oluştu' : 'Mağaza eklenirken hata oluştu',
        'error'
      );
    }
  };

  return (
    <Box>
      <Paper 
        elevation={8} 
        sx={{ 
          p: 4, 
          mb: 4, 
          borderRadius: 4,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
          border: '1px solid rgba(255,255,255,0.3)',
          backdropFilter: 'blur(20px)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #2196f3, #ff4081, #4caf50, #ff9800)',
            backgroundSize: '400% 400%',
            animation: 'gradient 3s ease infinite',
          },
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4,
          flexWrap: 'wrap',
          gap: 3
        }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Box sx={{
                p: 2,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
                boxShadow: '0 8px 32px rgba(33, 150, 243, 0.3)',
              }}>
                <StoreIcon sx={{ color: 'white', fontSize: 32 }} />
              </Box>
              <Box>
                <Typography 
                  variant="h3" 
                  component="h1" 
                  sx={{ 
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #2196f3 0%, #ff4081 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1
                  }}
                >
                  🏪 Mağaza Yönetimi
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Mağazalarınızı kolayca yönetin
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Chip 
                icon={<DashboardIcon />}
                label={`${stores.length} Mağaza`} 
                color="primary" 
                variant="filled"
                sx={{ 
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
                }}
              />
              <Chip 
                label={loading ? 'Yükleniyor...' : 'Hazır'} 
                color={loading ? 'warning' : 'success'} 
                variant="filled"
                sx={{ fontWeight: 600 }}
              />
              <Chip 
                label={`Toplam: ${stores.length}`}
                color="secondary"
                variant="outlined"
                sx={{ fontWeight: 600 }}
              />
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Tooltip title="Yenile" arrow>
              <IconButton 
                onClick={fetchStores}
                disabled={loading}
                sx={{ 
                  bgcolor: 'primary.light',
                  color: 'white',
                  p: 2,
                  '&:hover': { 
                    bgcolor: 'primary.main',
                    transform: 'rotate(180deg)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddStore}
              size="large"
              sx={{
                background: 'linear-gradient(135deg, #ff4081 0%, #c60055 100%)',
                boxShadow: '0 8px 32px rgba(255, 64, 129, 0.3)',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                '&:hover': {
                  background: 'linear-gradient(135deg, #c60055 0%, #9c0036 100%)',
                  boxShadow: '0 12px 40px rgba(255, 64, 129, 0.4)',
                  transform: 'translateY(-3px)',
                }
              }}
            >
              Yeni Mağaza Ekle
            </Button>
          </Box>
        </Box>

        <StoreList
          stores={stores}
          onEdit={handleEditStore}
          onDelete={handleDeleteStore}
          loading={loading}
        />
      </Paper>

      <StoreForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmitForm}
        store={editingStore}
        isEditing={isEditing}
      />

      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alert.severity}
          sx={{ 
            width: '100%',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            fontWeight: 600,
          }}
        >
          {alert.message}
        </Alert>
      </Snackbar>

      <Fab
        color="primary"
        aria-label="add"
        onClick={handleAddStore}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: 'linear-gradient(135deg, #ff4081 0%, #c60055 100%)',
          boxShadow: '0 8px 32px rgba(255, 64, 129, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #c60055 0%, #9c0036 100%)',
            boxShadow: '0 12px 40px rgba(255, 64, 129, 0.4)',
            transform: 'scale(1.1)',
          }
        }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default StorePage;