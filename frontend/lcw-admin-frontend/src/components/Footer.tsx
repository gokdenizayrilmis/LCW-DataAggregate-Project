import React from 'react';
import { Box, Typography, IconButton, Container, Divider } from '@mui/material';
import { GitHub, Instagram, LinkedIn } from '@mui/icons-material';

const Footer: React.FC = () => {
  return (
    <Box 
      component="footer" 
      sx={{
        width: '100%',
        backgroundColor: '#1e1e1e',
        color: '#fff',
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            py: 4,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 3
          }}
        >
          {/* Sol Kısım - LCW Branding */}
          <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              LCW Yönetim Sistemi
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              İyi giyinmek herkesin hakkı
            </Typography>
          </Box>

          {/* Orta Kısım - Copyright */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              © 2025 LCW Yönetim Sistemi
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.7, fontSize: '0.9rem', mt: 0.5 }}>
              Geliştirici: Gökdeniz Ayrılmış
            </Typography>
          </Box>

          {/* Sağ Kısım - Sosyal Medya */}
          <Box sx={{ display: 'flex', gap: 2 }}>
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
      </Container>
    </Box>
  );
};

export default Footer;