import React from 'react';
import { Typography, Box, CircularProgress, Paper } from '@mui/material';
import StoreCard from './StoreCard';
import { Store } from '../types';

interface StoreListProps {
  stores: Store[];
  onEdit: (store: Store) => void;
  onDelete: (id: number) => void;
  loading: boolean;
}

const StoreList: React.FC<StoreListProps> = ({
  stores,
  onEdit,
  onDelete,
  loading,
}) => {
  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        py: 8,
        gap: 2
      }}>
        <CircularProgress size={60} sx={{ color: 'primary.main' }} />
        <Typography variant="h6" color="text.secondary">
          Mağazalar yükleniyor...
        </Typography>
      </Box>
    );
  }

  if (stores.length === 0) {
    return (
      <Paper 
        elevation={0}
        sx={{ 
          textAlign: 'center', 
          py: 8,
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
          borderRadius: 3,
          border: '2px dashed #dee2e6'
        }}
      >
        <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
          🏪 Henüz mağaza bulunmuyor
        </Typography>
        <Typography variant="body1" color="text.secondary">
          İlk mağazanızı eklemek için "Yeni Mağaza Ekle" butonuna tıklayın.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: 3 
    }}>
      {stores.map((store) => (
        <StoreCard
          key={store.id}
          store={store}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </Box>
  );
};

export default StoreList; 