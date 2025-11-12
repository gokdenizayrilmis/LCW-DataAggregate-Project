import React from 'react';
import { Box, Typography, IconButton, Divider } from '@mui/material';
import { GitHub, Instagram, LinkedIn } from '@mui/icons-material';

const Footer: React.FC = () => {
  return (
    <Box 
      component="footer" 
      sx={{
        width: '100%',
        backgroundColor: '#1976d2',
        color: '#fff',
        mt: 'auto',
        borderTop: '3px solid #1565c0',
        position: 'relative',
        left: 0,
        right: 0,
        marginLeft: 0,
        zIndex: 1200,
      }}
    >
      <Box sx={{
        px: { xs: 2, md: 4 },
        py: 3,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 2,
        maxWidth: '1440px',
        margin: '0 auto',
      }}>
        {/* LCW Branding - Sol */}
        <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            LCW Yönetim Sistemi
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            İyi giyinmek herkesin hakkı
          </Typography>
        </Box>
        
        {/* Copyright - Orta */}
        <Box sx={{ flex: 1, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            © 2025 LCW Yönetim Sistemi
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.7, fontSize: '0.9rem', mt: 0.5 }}>
            Geliştirici: Gökdeniz Ayrılmış
          </Typography>
        </Box>
        
        {/* Social Media Links - Sağ */}
        <Box sx={{ flex: 1, display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' }, gap: 2 }}>
          <IconButton
            href="https://github.com/gokdenizayrilmis"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: '#fff',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease'
            }}
          >
            <GitHub />
          </IconButton>
          <IconButton
            href="https://www.instagram.com/gokdeniz.ayrilmis/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: '#fff',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease'
            }}
          >
            <Instagram />
          </IconButton>
          <IconButton
            href="https://www.linkedin.com/in/gokdenizayrilmis/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: '#fff',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease'
            }}
          >
            <LinkedIn />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer; 