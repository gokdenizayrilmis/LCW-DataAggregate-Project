import React, { useState } from 'react';
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
  CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff, Login, Email, Lock } from '@mui/icons-material';
import lcwLogo from '../assets/lcw-logo.png';
import { useNavigate } from 'react-router-dom';

const AdminLoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    console.log('Login attempt with:', formData);
    
    try {
      const response = await fetch('http://localhost:5283/api/User/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData),
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (response.ok) {
        const userData = await response.json();
        console.log('Login successful:', userData);
        
        // Token'ı localStorage'a kaydet
        localStorage.setItem('token', userData.token);
        localStorage.setItem('userRole', userData.user.role);
        localStorage.setItem('userData', JSON.stringify(userData.user));
        
        // Admin kontrolü
        if (userData.user.role === 'admin') {
                  console.log('Admin login successful, navigating to dashboard');
        navigate('/dashboard');
        } else {
          console.log('Non-admin user attempted login');
          setError('Bu hesap admin yetkisine sahip değil.');
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
          localStorage.removeItem('userData');
        }
      } else {
        const errorData = await response.text();
        console.error('Login failed:', errorData);
        setError('E-posta veya şifre hatalı.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Giriş yapılırken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f8fafc 0%, #e3f2fd 50%, #f3e5f5 100%)' }}>
      <Card sx={{ maxWidth: 400, width: '100%', boxShadow: 3, borderRadius: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
            <img src={lcwLogo} alt="LC Waikiki Logo" style={{ width: 80, marginBottom: 8 }} />
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#1976d2', mb: 1 }}>
              LC Waikiki Admin Paneli
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Yalnızca yetkili kullanıcılar giriş yapabilir.
            </Typography>
          </Box>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="E-posta"
              type="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                )
              }}
            />
            <TextField
              fullWidth
              label="Şifre"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3, borderRadius: 2, fontWeight: 700, fontSize: 16 }}
              startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <Login />}
              disabled={isLoading}
            >
              Giriş Yap
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminLoginPage; 