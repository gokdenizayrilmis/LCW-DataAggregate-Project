import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  Box,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  Avatar,
  Badge,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import StoreIcon from '@mui/icons-material/Store';
import { Store } from '../types';

interface StoreCardProps {
  store: Store;
  onEdit: (store: Store) => void;
  onDelete: (id: number) => void;
}

const StoreCard: React.FC<StoreCardProps> = ({ store, onEdit, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
        border: '1px solid rgba(255,255,255,0.3)',
        backdropFilter: 'blur(20px)',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-12px) scale(1.03)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.25)',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, #2196f3, #ff4081, #4caf50)',
          backgroundSize: '300% 300%',
          animation: 'gradient 2s ease infinite',
        },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
            <Badge
              badgeContent={store.id}
              color="primary"
              sx={{
                '& .MuiBadge-badge': {
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }
              }}
            >
              <Avatar
                sx={{
                  bgcolor: 'primary.main',
                  width: 56,
                  height: 56,
                  boxShadow: '0 8px 32px rgba(33, 150, 243, 0.3)',
                }}
              >
                <StoreIcon sx={{ fontSize: 28 }} />
              </Avatar>
            </Badge>
            
            <Box sx={{ flex: 1 }}>
              <Typography 
                variant="h5" 
                component="div" 
                sx={{ 
                  fontWeight: 700,
                  color: 'primary.main',
                  lineHeight: 1.2,
                  mb: 0.5
                }}
              >
                {store.name}
              </Typography>
              <Chip 
                label="Aktif" 
                size="small" 
                color="success"
                variant="filled"
                sx={{ fontWeight: 600 }}
              />
            </Box>
          </Box>
        </Box>

        <Divider sx={{ mb: 3, opacity: 0.3 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'flex-start', 
            gap: 2,
            transition: 'all 0.3s ease',
            transform: isHovered ? 'translateX(5px)' : 'translateX(0)',
          }}>
            <Box sx={{
              p: 1,
              borderRadius: 2,
              bgcolor: 'primary.light',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: 40,
            }}>
              <LocationOnIcon sx={{ fontSize: 20 }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
                Adres
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.5, mt: 0.5 }}>
                {store.address}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            transition: 'all 0.3s ease',
            transform: isHovered ? 'translateX(5px)' : 'translateX(0)',
            transitionDelay: '0.1s',
          }}>
            <Box sx={{
              p: 1,
              borderRadius: 2,
              bgcolor: 'success.light',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: 40,
            }}>
              <PhoneIcon sx={{ fontSize: 18 }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
                Telefon
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {store.phone}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            transition: 'all 0.3s ease',
            transform: isHovered ? 'translateX(5px)' : 'translateX(0)',
            transitionDelay: '0.2s',
          }}>
            <Box sx={{
              p: 1,
              borderRadius: 2,
              bgcolor: 'secondary.light',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: 40,
            }}>
              <EmailIcon sx={{ fontSize: 18 }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
                E-posta
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {store.email}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 3, opacity: 0.3 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
              Oluşturulma: {new Date(store.createdAt).toLocaleDateString('tr-TR')}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
              Güncellenme: {new Date(store.updatedAt).toLocaleDateString('tr-TR')}
            </Typography>
          </Box>
        </Box>
      </CardContent>

      <CardActions sx={{ p: 3, pt: 0, gap: 1, justifyContent: 'center' }}>
        <Tooltip title="Düzenle" arrow>
          <IconButton
            onClick={() => onEdit(store)}
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              p: 1.5,
              '&:hover': {
                bgcolor: 'primary.dark',
                transform: 'scale(1.1) rotate(5deg)',
                boxShadow: '0 8px 25px rgba(33, 150, 243, 0.4)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Sil" arrow>
          <IconButton
            onClick={() => onDelete(store.id)}
            sx={{
              bgcolor: 'error.main',
              color: 'white',
              p: 1.5,
              '&:hover': {
                bgcolor: 'error.dark',
                transform: 'scale(1.1) rotate(-5deg)',
                boxShadow: '0 8px 25px rgba(244, 67, 54, 0.4)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
};

export default StoreCard; 