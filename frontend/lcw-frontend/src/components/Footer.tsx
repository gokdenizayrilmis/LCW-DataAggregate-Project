import React from 'react';
import { Box, Typography, IconButton, Container, Divider } from '@mui/material';
import { GitHub, Instagram, LinkedIn } from '@mui/icons-material';

const Footer: React.FC = () => {
  return (
    <Box sx={{ 
      mt: 'auto',
      background: 'rgba(24,28,36,0.65)',
      py: 2,
      zIndex: 20,
      position: 'relative',
      width: '100%',
      left: 0,
      right: 0,
      borderRadius: 0,
      boxShadow: '0 2px 12px #0004',
    }}>
      <Box sx={{
        px: { xs: 2, md: 4 },
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between',
        alignItems: 'center',
        color: '#fff',
        width: '100%',
        maxWidth: '1440px',
        margin: '0 auto',
      }}>
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
          width: '100%',
        }}>
          {/* LCW Branding - Sol */}
          <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' }, color: '#fff' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontSize: '1.1rem', color: '#fff' }}>
              LCW Yönetim Sistemi
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '0.95rem', color: '#fff' }}>
              İyi giyinmek herkesin hakkı
            </Typography>
          </Box>
          {/* Copyright - Orta */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ textAlign: 'center', opacity: 0.7, fontSize: '0.95rem', color: '#fff' }}>
              © 2025 LCW Yönetim Sistemi.<br />
              <span style={{ fontSize: '0.92em', opacity: 0.8 }}>Geliştirici: Gökdeniz Ayrılmış</span>
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
        
        <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.2)' }} />
        
      </Box>
    </Box>
  );
};

export default Footer; 