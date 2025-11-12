import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress as MuiCircularProgress
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Login,
  Email,
  Lock,
  Store as StoreIcon,
  Inventory2 as InventoryIcon
} from '@mui/icons-material';
import lcwLogo from '../assets/lcw-logo.png';
import lcwStore from '../assets/lcw-store.jpg';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { Global } from '@emotion/react';

const StatCardGlass = ({ icon, value, label }: { icon: React.ReactNode; value: string | number; label: string }) => (
  <Box
    sx={{
      width: 160,
      height: 170,
      background: 'rgba(255,255,255,0.12)',
      borderRadius: 2,
      p: 2,
      textAlign: 'center',
      boxShadow: '0 8px 32px 0 rgba(31,38,135,0.2)',
      backdropFilter: 'blur(8px)',
      border: '1.5px solid rgba(255,255,255,0.25)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 1
    }}
  >
    <Box sx={{ mb: 1 }}>{icon}</Box>
    <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: 28, lineHeight: 1 }}>{value}</Typography>
    <Typography sx={{ color: '#e3f2fd', fontWeight: 600, fontSize: 15, mt: 1 }}>{label}</Typography>
  </Box>
);

const Countdown: React.FC = () => {
  const target = new Date('2026-12-31T23:59:59');
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const diff = target.getTime() - now.getTime();
  const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  const hours = Math.max(0, Math.floor((diff / (1000 * 60 * 60)) % 24));
  const minutes = Math.max(0, Math.floor((diff / (1000 * 60)) % 60));
  const seconds = Math.max(0, Math.floor((diff / 1000) % 60));

  return (
    <Box
      sx={{
        textAlign: 'center',
        mt: 2,
        p: 2,
        background: 'rgba(24,28,36,0.7)',
        borderRadius: 3,
        boxShadow: '0 2px 12px #0004',
        maxWidth: 420,
        mx: 'auto'
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{ color: '#fff', fontWeight: 700, mb: 2, fontSize: 20, letterSpacing: 1, textShadow: '0 2px 8px #1976d2' }}
      >
        2026'ya Kalan
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
        {[
          { value: days, label: 'gün' },
          { value: hours, label: 'saat' },
          { value: minutes, label: 'dk' },
          { value: seconds, label: 'sn' }
        ].map((item) => (
          <Box
            key={item.label}
            sx={{
              minWidth: 60,
              minHeight: 60,
              background: 'rgba(25, 118, 210, 0.18)',
              borderRadius: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 12px #0002',
              m: '0 8px'
            }}
          >
            <span style={{ fontSize: 28, fontWeight: 900, color: '#fff', textShadow: '0 2px 8px #1976d2' }}>{item.value}</span>
            <span style={{ fontSize: 13, color: '#90caf9', fontWeight: 700 }}>{item.label}</span>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const AdminLoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowForm(true), 120);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      emailRef.current?.focus();
      emailRef.current?.blur();
      passwordRef.current?.focus();
      passwordRef.current?.blur();
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5283/api/User/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const userData = await response.json();
        // Token'ı localStorage'a kaydet
        localStorage.setItem('token', userData.token);
        localStorage.setItem('userRole', userData.user.role);
        localStorage.setItem('userData', JSON.stringify(userData.user));
        
        // Admin kontrolü
        if (userData.user.role === 'admin') {
          navigate('/dashboard');
        } else {
          setError('Bu hesap admin yetkisine sahip değil.');
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
          localStorage.removeItem('userData');
        }
      } else {
        setError('E-posta veya şifre hatalı.');
      }
    } catch (err) {
      setError('Giriş yapılırken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const autofillStyles = (
    <Global
      styles={`
        body {
          background: transparent !important;
        }
        input:-webkit-autofill,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 1000px #232a36 inset !important;
          box-shadow: 0 0 0 1000px #232a36 inset !important;
          -webkit-text-fill-color: #fff !important;
          caret-color: #fff !important;
          color: #fff !important;
          border-radius: 8px;
        }
      `}
    />
  );

  const highlightStats = [
    { icon: <StoreIcon sx={{ fontSize: 36, color: '#fff' }} />, value: 540, label: 'Yurt İçi Mağaza' },
    { icon: <StoreIcon sx={{ fontSize: 36, color: '#fff' }} />, value: 640, label: 'Yurt Dışı Mağaza' },
    { icon: <InventoryIcon sx={{ fontSize: 36, color: '#fff' }} />, value: '55.000', label: 'Çalışan' }
  ];

  return (
    <>
      {autofillStyles}
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          bgcolor: '#10141f',
          color: '#fff'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            width: '100%',
            height: '100%',
            background: `linear-gradient(rgba(10,14,20,0.3), rgba(10,14,20,0.3)), url(${lcwStore}) center center/cover no-repeat`,
            filter: 'blur(0.8px) brightness(0.7)'
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            width: '100%',
            height: '100%',
            background: 'rgba(12,16,24,0.28)'
          }}
        />

        <Box
          component="main"
          sx={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            alignItems: 'stretch',
            minHeight: 'calc(100vh - 80px)',
            px: { xs: 1, md: 4, lg: 8 },
            py: { xs: 2, md: 6 },
            gap: { xs: 2, md: 4 },
            zIndex: 2,
            position: 'relative',
            pb: { xs: 6, md: 8 }
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Card
              sx={{
                width: '100%',
                maxWidth: 500,
                px: 3,
                borderRadius: 3,
                boxShadow: '0 8px 32px #0008',
                background: 'rgba(24,28,36,0.92)',
                color: '#fff',
                border: 'none',
                backdropFilter: 'blur(2px)'
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
                  <img src={lcwLogo} alt="LC Waikiki" style={{ width: 180, height: 64, objectFit: 'contain', display: 'block' }} />
                </Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    textAlign: 'center',
                    mb: 3,
                    color: '#fff',
                    letterSpacing: 1,
                    fontFamily: 'Poppins, Montserrat, sans-serif'
                  }}
                >
                  Yönetim Paneline Giriş Yap
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2, gap: 1 }}>
                  <Lock sx={{ color: '#1976d2', fontSize: 20, mr: 0.5 }} />
                  <Typography sx={{ color: '#fff', fontWeight: 500, fontSize: 15 }}>Güvenli Giriş</Typography>
                </Box>
                {error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                )}
                {showForm && (
                  <form onSubmit={handleSubmit}>
                    <TextField
                      fullWidth
                      label="E-posta"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      inputRef={emailRef}
                      sx={{
                        mb: 3,
                        input: { color: '#fff', background: 'transparent' },
                        label: { color: '#fff' },
                        backgroundColor: 'transparent',
                        borderRadius: 2,
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'transparent',
                          color: '#fff',
                          borderColor: '#1976d2',
                          '& fieldset': { borderColor: '#1976d2' },
                          '&:hover fieldset': { borderColor: '#1976d2' },
                          '&.Mui-focused fieldset': { borderColor: '#1976d2' }
                        }
                      }}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email sx={{ color: '#1976d2' }} />
                          </InputAdornment>
                        ),
                        style: { color: '#fff' }
                      }}
                      InputLabelProps={{ style: { color: '#fff' } }}
                      focused
                    />
                    <TextField
                      fullWidth
                      label="Şifre"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      inputRef={passwordRef}
                      sx={{
                        mb: 3,
                        input: { color: '#fff', background: 'transparent' },
                        label: { color: '#fff' },
                        backgroundColor: 'transparent',
                        borderRadius: 2,
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'transparent',
                          color: '#fff',
                          borderColor: '#1976d2',
                          '& fieldset': { borderColor: '#1976d2' },
                          '&:hover fieldset': { borderColor: '#1976d2' },
                          '&.Mui-focused fieldset': { borderColor: '#1976d2' }
                        }
                      }}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock sx={{ color: '#1976d2' }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                              {showPassword ? <VisibilityOff sx={{ color: '#1976d2' }} /> : <Visibility sx={{ color: '#1976d2' }} />}
                            </IconButton>
                          </InputAdornment>
                        ),
                        style: { color: '#fff' }
                      }}
                      InputLabelProps={{ style: { color: '#fff' } }}
                      focused
                    />
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      size="large"
                      disabled={isLoading}
                      startIcon={isLoading ? <MuiCircularProgress size={20} color="inherit" /> : <Login />}
                      sx={{
                        py: 2,
                        fontWeight: 700,
                        fontSize: '1.05rem',
                        background: 'linear-gradient(90deg, #1976d2 0%, #2196f3 100%)',
                        boxShadow: '0 4px 16px #1976d244',
                        borderRadius: 2,
                        color: '#fff',
                        '&:hover': {
                          background: 'linear-gradient(90deg, #1565c0 0%, #1976d2 100%)'
                        },
                        '&:disabled': {
                          background: '#e3f2fd',
                          color: '#1976d2'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
            <Box
              sx={{
                display: 'flex',
                gap: 3,
                mt: 5,
                justifyContent: 'center',
                width: '100%',
                maxWidth: 600,
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center'
              }}
            >
              {highlightStats.map((stat) => (
                <StatCardGlass key={stat.label} icon={stat.icon} value={stat.value} label={stat.label} />
              ))}
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'center',
              pl: { xs: 0, md: 6, lg: 12 },
              zIndex: 2
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                mb: 2,
                fontFamily: 'Poppins, Montserrat, sans-serif',
                fontSize: { xs: 28, md: 38, lg: 48 },
                letterSpacing: 1,
                px: 2.5,
                py: 1.5,
                borderRadius: 3,
                display: 'inline-block',
                background: 'rgba(24,28,36,0.65)',
                boxShadow: '0 4px 24px 0 rgba(0,0,0,0.18)',
                color: '#fff',
                WebkitTextStroke: '1.5px #1976d2',
                textShadow: '0 2px 12px #1976d2, 0 1px 0 #fff'
              }}
            >
              LC Waikiki Yönetim Paneli
            </Typography>
            <Typography
              sx={{
                color: '#fff',
                fontWeight: 600,
                mb: 3,
                maxWidth: 520,
                fontSize: { xs: 16, md: 20, lg: 24 },
                lineHeight: 1.5,
                textShadow: '0 2px 8px #1976d2'
              }}
            >
              LC Waikiki, 2026 yılına kadar Avrupa'nın en büyük üç hazır giyim markasından biri olmayı ve yeni pazarlara açılmayı hedefliyor.
              Yönetim paneli, mağaza performanslarını tek panelden takip etmenize ve ekipleri yönlendirmenize yardımcı olur.
            </Typography>
            <Countdown />
          </Box>
        </Box>
        <Footer />
      </Box>
    </>
  );
};

export default AdminLoginPage; 