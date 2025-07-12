import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Divider,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import StoreIcon from '@mui/icons-material/Store';
import { Store, CreateStoreRequest, UpdateStoreRequest } from '../types';

interface StoreFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateStoreRequest | UpdateStoreRequest) => void;
  store?: Store | null;
  isEditing: boolean;
}

const StoreForm: React.FC<StoreFormProps> = ({
  open,
  onClose,
  onSubmit,
  store,
  isEditing,
}) => {
  const [formData, setFormData] = useState<CreateStoreRequest>({
    name: '',
    address: '',
    phone: '',
    email: '',
  });

  useEffect(() => {
    if (store && isEditing) {
      setFormData({
        name: store.name,
        address: store.address,
        phone: store.phone,
        email: store.email,
      });
    } else {
      setFormData({
        name: '',
        address: '',
        phone: '',
        email: '',
      });
    }
  }, [store, isEditing, open]);

  const handleChange = (field: keyof CreateStoreRequest) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        }
      }}
    >
      <DialogTitle sx={{ 
        pb: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <StoreIcon sx={{ color: 'primary.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {isEditing ? 'Mağaza Düzenle' : 'Yeni Mağaza Ekle'}
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            color: 'text.secondary',
            '&:hover': { color: 'text.primary' }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Mağaza Adı"
              value={formData.name}
              onChange={handleChange('name')}
              fullWidth
              required
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
            
            <TextField
              label="Adres"
              value={formData.address}
              onChange={handleChange('address')}
              fullWidth
              required
              multiline
              rows={3}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
            
            <TextField
              label="Telefon"
              value={formData.phone}
              onChange={handleChange('phone')}
              fullWidth
              required
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
            
            <TextField
              label="E-posta"
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              fullWidth
              required
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
          </Box>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button 
            onClick={handleCancel}
            variant="outlined"
            sx={{ 
              borderRadius: 2,
              px: 3
            }}
          >
            İptal
          </Button>
          <Button 
            type="submit" 
            variant="contained"
            sx={{
              borderRadius: 2,
              px: 3,
              background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
              boxShadow: '0 4px 15px rgba(25, 118, 210, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
                boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
              }
            }}
          >
            {isEditing ? 'Güncelle' : 'Ekle'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default StoreForm;