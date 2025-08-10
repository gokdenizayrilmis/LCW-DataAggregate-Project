import React, { useState, useEffect, useRef } from 'react';
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
import { useNavigate } from 'react-router-dom';
import lcwLogo from '../assets/lcw-logo.png';
import lcwStore from '../assets/lcw-store.jpg';
import Footer from '../components/Footer';
import { Global } from '@emotion/react';
import CircularProgress from '@mui/material/CircularProgress';

// API response types
interface Store {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  isActive: boolean;
  createdAt: string;
}

interface Employee {
  id: number;
  name: string;
  surname: string;
  position: string;
  storeId: number;
  isActive: boolean;
}

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stockQuantity: number;
  storeId: number;
  isActive: boolean;
}


// Modern ve animasyonlu sayaç componenti
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
    <Box sx={{ textAlign: 'center', mt: 2, p: 2, background: 'rgba(24,28,36,0.7)', borderRadius: 3, boxShadow: '0 2px 12px #0004', maxWidth: 420, mx: 'auto' }}>
      <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 700, mb: 2, fontSize: 20, letterSpacing: 1, textShadow: '0 2px 8px #1976d2' }}>
        2026'ya Kalan
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
        <Box sx={{ minWidth: 60, minHeight: 60, background: 'rgba(25, 118, 210, 0.18)', borderRadius: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 12px #0002', m: '0 8px', animation: 'pop 0.7s cubic-bezier(.68,-0.55,.27,1.55)' }}>
          <span style={{ fontSize: 28, fontWeight: 900, color: '#fff', textShadow: '0 2px 8px #1976d2' }}>{days}</span>
          <span style={{ fontSize: 13, color: '#90caf9', fontWeight: 700 }}>gün</span>
        </Box>
        <Box sx={{ minWidth: 60, minHeight: 60, background: 'rgba(25, 118, 210, 0.18)', borderRadius: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 12px #0002', m: '0 8px', animation: 'pop 0.7s cubic-bezier(.68,-0.55,.27,1.55)' }}>
          <span style={{ fontSize: 28, fontWeight: 900, color: '#fff', textShadow: '0 2px 8px #1976d2' }}>{hours}</span>
          <span style={{ fontSize: 13, color: '#90caf9', fontWeight: 700 }}>saat</span>
        </Box>
        <Box sx={{ minWidth: 60, minHeight: 60, background: 'rgba(25, 118, 210, 0.18)', borderRadius: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 12px #0002', m: '0 8px', animation: 'pop 0.7s cubic-bezier(.68,-0.55,.27,1.55)' }}>
          <span style={{ fontSize: 28, fontWeight: 900, color: '#fff', textShadow: '0 2px 8px #1976d2' }}>{minutes}</span>
          <span style={{ fontSize: 13, color: '#90caf9', fontWeight: 700 }}>dk</span>
        </Box>
        <Box sx={{ minWidth: 60, minHeight: 60, background: 'rgba(25, 118, 210, 0.18)', borderRadius: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 12px #0002', m: '0 8px', animation: 'pop 0.7s cubic-bezier(.68,-0.55,.27,1.55)' }}>
          <span style={{ fontSize: 28, fontWeight: 900, color: '#fff', textShadow: '0 2px 8px #1976d2' }}>{seconds}</span>
          <span style={{ fontSize: 13, color: '#90caf9', fontWeight: 700 }}>sn</span>
        </Box>
      </Box>
      <style>{`
        @keyframes pop {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </Box>
  );
};

const StatCardGlass = ({ icon, value, label }: { icon: React.ReactNode, value: string | number, label: string }) => (
  <Box sx={{ width: 160, height: 170, background: 'rgba(255,255,255,0.12)', borderRadius: 2, p: 2, textAlign: 'center', boxShadow: '0 8px 32px 0 rgba(31,38,135,0.18)', backdropFilter: 'blur(8px)', border: '1.5px solid rgba(255,255,255,0.25)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
    <Box sx={{ mb: 1 }}>{icon}</Box>
    <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: 28, lineHeight: 1 }}>{value}</Typography>
    <Typography sx={{ color: '#e3f2fd', fontWeight: 600, fontSize: 15, mt: 1 }}>{label}</Typography>
  </Box>
);

const HomePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [showForm, setShowForm] = useState(false);
  
  // Dynamic data states
  const [stores, setStores] = useState<Store[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // API'den verileri çek
  const fetchData = async () => {
    try {
      const [storesResponse, employeesResponse, productsResponse] = await Promise.all([
        fetch('http://localhost:5283/api/stores/active'),
        fetch('http://localhost:5283/api/Employee'),
        fetch('http://localhost:5283/api/Product')
      ]);

      if (storesResponse.ok) {
        const storesData = await storesResponse.json();
        setStores(storesData);
      }

      if (employeesResponse.ok) {
        const employeesData = await employeesResponse.json();
        setEmployees(employeesData);
      }

      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        setProducts(productsData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => setShowForm(true), 100); // 100ms sonra formu göster
    fetchData(); // Veri çekmeyi başlat
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (emailRef.current) {
        emailRef.current.focus();
        emailRef.current.blur();
      }
      if (passwordRef.current) {
        passwordRef.current.focus();
        passwordRef.current.blur();
      }
    }, 200);
  }, []);

  // Kullanıcı tipi seçimi ve admin ile ilgili kodlar kaldırıldı

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
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        const userData = await response.json();
        
        // Token'ı localStorage'a kaydet
        localStorage.setItem('token', userData.token);
        localStorage.setItem('userRole', userData.user.role);
        localStorage.setItem('userData', JSON.stringify(userData.user));
        
        // Eğer admin ise uyarı ver, değilse mağaza detay sayfasına yönlendir
        if (userData.user.role === 'admin') {
          setError('Bu hesap admin yetkisine sahip. Lütfen admin panelinden giriş yapın.');
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
          localStorage.removeItem('userData');
        } else {
          // Mağaza çalışanı ise mağaza detay sayfasına yönlendir
          if (userData.user.storeId) {
            navigate(`/store/${userData.user.storeId}`);
          } else {
            navigate('/dashboard');
          }
        }
      } else {
        const errorData = await response.text();
        setError('Girdiğiniz bilgiler hatalı');
        console.error('Login error:', errorData);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Giriş yapılırken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  // Autofill için global stil
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

  return (
    <>
      {autofillStyles}
      {loading ? (
        <Box sx={{
          minHeight: '100vh',
          width: '100vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(24,28,36,0.85)',
          zIndex: 9999,
          position: 'fixed',
          left: 0,
          top: 0,
        }}>
          <CircularProgress size={64} thickness={4.5} sx={{ color: '#1976d2' }} />
        </Box>
      ) : (
        <Box sx={{
          minHeight: '100vh',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          background: 'transparent',
          zIndex: 0,
        }}>
          {/* Arka plan görseli ve koyu overlay */}
          <Box sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            width: '100%',
            height: '100%',
            background: `url(${lcwStore}) center center/cover no-repeat`,
            filter: 'blur(3px) brightness(0.22)', // DAHA FAZLA KARARTMA
          }} />
          <Box sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            width: '100%',
            height: '100%',
            background: 'rgba(24,28,36,0.38)', // DAHA DA ŞEFFAF KOYU OVERLAY
          }} />
          <Box sx={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            alignItems: 'stretch',
            minHeight: 'calc(100vh - 80px)',
            px: { xs: 1, md: 4, lg: 8 },
            py: { xs: 2, md: 6 },
            gap: { xs: 2, md: 4 },
            zIndex: 2,
          }}>
            {/* Sol: Login card ve dashboard kutucukları */}
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Card sx={{
                width: '100%',
                maxWidth: 500,
                px: 3,
                borderRadius: 3,
                boxShadow: '0 8px 32px #0008',
                background: 'rgba(24,28,36,0.92)', // KOYU KART
                color: '#fff', // BEYAZ YAZI
                border: 'none',
                backdropFilter: 'blur(2px)',
                animation: 'fadeIn 1s',
              }}>
                <CardContent sx={{ p: 4 }}>
                  {/* LC Waikiki Logo */}
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
                    <img src={lcwLogo} alt="LC Waikiki" style={{ width: 180, height: 64, objectFit: 'contain', display: 'block' }} />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, textAlign: 'center', mb: 3, color: '#fff', letterSpacing: 1, fontFamily: 'Poppins, Montserrat, sans-serif' }}>
                    Giriş Yap
                  </Typography>
                  {/* Kullanıcı tipi seçimi kaldırıldı */}
                  {/* Güvenli Giriş */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2, gap: 1 }}>
                    <Lock sx={{ color: '#1976d2', fontSize: 20, mr: 0.5 }} />
                    <Typography sx={{ color: '#fff', fontWeight: 500, fontSize: 15 }}>
                      Güvenli Giriş
                    </Typography>
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
                        sx={{ mb: 3, input: { color: '#fff', background: 'transparent', boxShadow: 'none !important' }, label: { color: '#fff' }, backgroundColor: 'transparent', borderRadius: 2, '& .MuiOutlinedInput-root': { backgroundColor: 'transparent', color: '#fff', borderColor: '#1976d2', '& fieldset': { borderColor: '#1976d2', backgroundColor: 'transparent', }, '&:hover fieldset': { borderColor: '#1976d2', backgroundColor: 'transparent', }, '&.Mui-focused fieldset': { borderColor: '#1976d2', backgroundColor: 'transparent', }, }, }}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Email sx={{ color: '#1976d2' }} />
                            </InputAdornment>
                          ),
                          style: { color: '#fff', background: 'transparent', boxShadow: 'none' },
                        }}
                        InputLabelProps={{ style: { color: '#fff', background: 'transparent' } }}
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
                        sx={{ mb: 3, input: { color: '#fff', background: 'transparent', boxShadow: 'none !important' }, label: { color: '#fff' }, backgroundColor: 'transparent', borderRadius: 2, '& .MuiOutlinedInput-root': { backgroundColor: 'transparent', color: '#fff', borderColor: '#1976d2', '& fieldset': { borderColor: '#1976d2', backgroundColor: 'transparent', }, '&:hover fieldset': { borderColor: '#1976d2', backgroundColor: 'transparent', }, '&.Mui-focused fieldset': { borderColor: '#1976d2', backgroundColor: 'transparent', }, }, }}
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
                          style: { color: '#fff', background: 'transparent', boxShadow: 'none' },
                        }}
                        InputLabelProps={{ style: { color: '#fff', background: 'transparent' } }}
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
                          fontSize: '1.1rem',
                          background: 'linear-gradient(90deg, #1976d2 0%, #2196f3 100%)',
                          boxShadow: '0 4px 16px #1976d244',
                          borderRadius: 2,
                          color: '#fff',
                          '&:hover': {
                            background: 'linear-gradient(90deg, #1565c0 0%, #1976d2 100%)',
                            transform: 'none',
                          },
                          '&:disabled': {
                            background: '#e3f2fd',
                            color: '#1976d2',
                            transform: 'none',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
              {/* Dashboard kutucukları giriş kutusunun dışında */}
              <Box sx={{ display: 'flex', gap: 3, mt: 5, justifyContent: 'center', width: '100%', maxWidth: 600, flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center' }}>
                <StatCardGlass icon={<StoreIcon sx={{ fontSize: 38, color: '#fff' }} />} value={540} label="Yurt İçi Mağaza " />
                <StatCardGlass icon={<StoreIcon sx={{ fontSize: 38, color: '#fff' }} />} value={640} label="Yurt Dışı Mağaza" />
                <StatCardGlass icon={<InventoryIcon sx={{ fontSize: 38, color: '#fff' }} />} value={'55.000'} label="Çalışan" />
              </Box>
            </Box>
            {/* Sağ: LC Waikiki vizyon paneli ve sayaç */}
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'center',
              pl: { xs: 0, md: 6, lg: 12 },
            }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 900,
                  mb: 2,
                  fontFamily: 'Poppins, Montserrat, sans-serif', // DAHA MODERN FONT
                  fontSize: { xs: 28, md: 38, lg: 48 },
                  letterSpacing: 1,
                  px: 2.5,
                  py: 1.5,
                  borderRadius: 3,
                  display: 'inline-block',
                  background: 'rgba(24,28,36,0.65)', // FOOTER İLE UYUMLU KOYU KUTU
                  boxShadow: '0 4px 24px 0 rgba(0,0,0,0.18)',
                  color: '#fff', // BEYAZ YAZI
                  textStroke: '1.5px #1976d2',
                  WebkitTextStroke: '1.5px #1976d2',
                  textShadow: '0 2px 12px #1976d2, 0 1px 0 #fff',
                }}
              >
                LC Waikiki Yönetim Paneli
              </Typography>
              <Typography sx={{ color: '#fff', fontWeight: 600, mb: 3, maxWidth: 500, fontSize: { xs: 16, md: 20, lg: 24 }, lineHeight: 1.5, textShadow: '0 2px 8px #1976d2' }}>
                LC Waikiki, 2025 yılında ihracatını 1,4 milyar dolara çıkaracak, 2026 yılı sonuna kadar da Avrupa'nın en büyük üç hazır giyim markasından biri olmayı ve İngiltere, Almanya, Fransa gibi gelişmiş pazarlara adım atmayı hedefliyor.
              </Typography>
              <Countdown />
            </Box>
          </Box>
          <Footer />
        </Box>
      )}
    </>
  );
};

export default HomePage; 