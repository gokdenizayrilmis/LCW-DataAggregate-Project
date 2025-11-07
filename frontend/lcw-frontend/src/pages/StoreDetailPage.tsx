import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Alert,
  CircularProgress,
  Avatar,
  Tab,
  Tabs,
  CardMedia,
  TextField,
  InputAdornment,
  LinearProgress
} from '@mui/material';
import {
  Store as StoreIcon,
  Inventory2 as InventoryIcon,
  TrendingUp as TrendingUpIcon,
  Search as SearchIcon,
  People as PeopleIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface StoreData {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  userCount: number;
  saleCount: number;
  returnCount: number;
  inventoryCount: number;
}

interface Employee {
  id: number;
  name: string;
  surname: string;
  position: string;
  salary: number;
  hireDate: string;
  email: string;
  phone: string;
  avatar: string;
  storeId: number;
  isActive: boolean;
}

interface Product {
  id: number;
  name: string;
  code: string;
  category: string;
  price: number;
  stockQuantity: number;
  imageUrl: string;
  description: string;
  storeId: number;
  isActive: boolean;
}

const StoreDetailPage: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const [storeData, setStoreData] = useState<StoreData | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentTab, setCurrentTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (storeId) {
      console.log('🔄 useEffect triggered for storeId:', storeId);
      fetchStoreData();
    }
  }, [storeId]);

  const fetchStoreData = async () => {
    try {
      console.log('🚀 fetchStoreData started for storeId:', storeId);
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Giriş yapmanız gerekiyor');
        setLoading(false);
        return;
      }

      // Store bilgilerini al
      const storeResponse = await fetch(`http://localhost:5283/api/stores/${storeId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (storeResponse.ok) {
        const storeData = await storeResponse.json();
        console.log('✅ Store data fetched:', storeData);
        setStoreData(storeData);
      } else {
        setError('Mağaza bilgileri yüklenemedi');
        setLoading(false);
        return;
      }

      // Çalışanları al
      try {
        const employeesResponse = await fetch(`http://localhost:5283/api/Employee/store/${storeId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (employeesResponse.ok) {
          const employeesData = await employeesResponse.json();
          console.log('✅ Employees data fetched:', employeesData);
          setEmployees(Array.isArray(employeesData) ? employeesData : []);
        }
      } catch (e) {
        console.log('❌ Çalışan verisi alınamadı:', e);
        setEmployees([]);
      }

      // Ürünleri al
      try {
        const productsResponse = await fetch(`http://localhost:5283/api/Product/store/${storeId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          console.log('✅ Products data fetched:', productsData);
          setProducts(Array.isArray(productsData) ? productsData : []);
        }
      } catch (e) {
        console.log('❌ Ürün verisi alınamadı:', e);
        setProducts([]);
      }

    } catch (error) {
      console.error('❌ Veri yükleme hatası:', error);
      setError('Veriler yüklenirken hata oluştu');
    } finally {
      console.log('🏁 fetchStoreData completed');
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <Box sx={{ p: 3, flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Alert severity="error" sx={{ fontSize: '1.2rem' }}>
            {error}
          </Alert>
        </Box>
        <Footer />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar 
        storeData={storeData ? {
          id: storeData.id,
          name: storeData.name,
          isActive: storeData.isActive
        } : undefined}
      />

      <Box sx={{ p: 3, flex: 1 }}>
        {/* Store Info Card */}
        <Card sx={{ mb: 3, borderRadius: 3, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <StoreIcon sx={{ fontSize: 40, color: '#1976d2' }} />
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2' }}>
                  {storeData?.name || 'Mağaza'}
                </Typography>
                <Typography variant="body1" sx={{ color: '#666' }}>
                  Mağaza Detayları
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationIcon sx={{ color: '#666' }} />
                <Typography variant="body2" sx={{ color: '#666' }}>
                  {storeData?.address || 'Adres bilgisi yok'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon sx={{ color: '#666' }} />
                <Typography variant="body2" sx={{ color: '#666' }}>
                  {storeData?.phone || 'Telefon bilgisi yok'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon sx={{ color: '#666' }} />
                <Typography variant="body2" sx={{ color: '#666' }}>
                  {storeData?.email || 'Email bilgisi yok'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <StoreIcon sx={{ color: storeData?.isActive ? '#4caf50' : '#f44336' }} />
                <Typography variant="body2" sx={{ color: storeData?.isActive ? '#4caf50' : '#f44336' }}>
                  {storeData?.isActive ? 'Aktif' : 'Pasif'}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 3 }}>
          <Card sx={{ borderRadius: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <CardContent sx={{ textAlign: 'center', color: 'white' }}>
              <PeopleIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {employees.length}
              </Typography>
              <Typography variant="body2">Çalışan</Typography>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
            <CardContent sx={{ textAlign: 'center', color: 'white' }}>
              <InventoryIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {products.length}
              </Typography>
              <Typography variant="body2">Ürün</Typography>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3, background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
            <CardContent sx={{ textAlign: 'center', color: 'white' }}>
              <TrendingUpIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {storeData?.saleCount || 0}
              </Typography>
              <Typography variant="body2">Satış</Typography>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3, background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
            <CardContent sx={{ textAlign: 'center', color: 'white' }}>
              <StoreIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {storeData?.inventoryCount || 0}
              </Typography>
              <Typography variant="body2">Stok</Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Tabs */}
        <Card sx={{ mb: 3, borderRadius: 3 }}>
          <Tabs 
            value={currentTab} 
            onChange={handleTabChange}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab 
              label="Genel Bakış" 
              sx={{ minHeight: 64, fontSize: '1rem' }}
            />
            <Tab 
              icon={<PeopleIcon />} 
              label="Personel" 
              sx={{ minHeight: 64, fontSize: '1rem' }}
            />
            <Tab 
              icon={<InventoryIcon />} 
              label="Ürünler" 
              sx={{ minHeight: 64, fontSize: '1rem' }}
            />
          </Tabs>
        </Card>

        {/* Tab İçerikleri */}
        {currentTab === 0 && (
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#1976d2' }}>
                Mağaza Özeti
              </Typography>
              
              {employees.length === 0 && products.length === 0 ? (
                <Alert severity="info" sx={{ mb: 2 }}>
                  Bu mağaza için henüz çalışan veya ürün bilgisi eklenmemiş.
                </Alert>
              ) : (
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
                  <Box>
                    <Typography variant="h6" sx={{ mb: 2, color: '#666' }}>
                      Çalışan Durumu
                    </Typography>
                    <Typography variant="body1">
                      Toplam {employees.length} çalışan bulunuyor.
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ mb: 2, color: '#666' }}>
                      Ürün Durumu
                    </Typography>
                    <Typography variant="body1">
                      Toplam {products.length} ürün bulunuyor.
                    </Typography>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        )}

        {currentTab === 1 && (
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#1976d2' }}>
                Mağaza Personeli ({employees.length} kişi)
              </Typography>
              
              {employees.length === 0 ? (
                <Alert severity="info">
                  Bu mağaza için henüz çalışan bilgisi eklenmemiş.
                </Alert>
              ) : (
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
                  {employees.map((employee) => (
                    <Card key={employee.id} sx={{ 
                      borderRadius: 2, 
                      boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': { 
                        transform: 'translateY(-4px)',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                      }
                    }}>
                      <CardContent sx={{ textAlign: 'center', p: 3 }}>
                        <Avatar 
                          src={employee.avatar}
                          sx={{ 
                            width: 80, 
                            height: 80, 
                            mx: 'auto', 
                            mb: 2,
                            border: '3px solid #e3f2fd'
                          }}
                        >
                          {employee.name[0]}
                        </Avatar>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                          {employee.name} {employee.surname}
                        </Typography>
                        <Chip 
                          label={employee.position}
                          color={employee.position === 'Mağaza Müdürü' ? 'primary' : 
                                 employee.position === 'Müdür Yardımcısı' ? 'secondary' : 'default'}
                          sx={{ mb: 2 }}
                        />
                        <Box sx={{ textAlign: 'left' }}>
                          <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                            📧 {employee.email}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                            📱 {employee.phone}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                            💰 ₺{employee.salary.toLocaleString('tr-TR')}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#666' }}>
                            📅 {new Date(employee.hireDate).toLocaleDateString('tr-TR')}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        )}

        {currentTab === 2 && (
          <Box>
            {/* Arama */}
            <Card sx={{ mb: 3, borderRadius: 3 }}>
              <CardContent>
                <TextField
                  fullWidth
                  placeholder="Ürün ara (isim, kategori)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ borderRadius: 2 }}
                />
              </CardContent>
            </Card>

            {/* Ürünler */}
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#1976d2' }}>
                  Mağaza Ürünleri ({filteredProducts.length} ürün)
                </Typography>
                
                {products.length === 0 ? (
                  <Alert severity="info">
                    Bu mağaza için henüz ürün bilgisi eklenmemiş.
                  </Alert>
                ) : (
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 3 }}>
                    {filteredProducts.map((product) => (
                      <Card key={product.id} sx={{ 
                        borderRadius: 2,
                        boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
                        transition: 'all 0.3s ease',
                        '&:hover': { 
                          transform: 'translateY(-4px)',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                        }
                      }}>
                        <CardMedia
                          component="img"
                          height="200"
                          image={`http://localhost:5283${product.imageUrl}`}
                          alt={product.name}
                          sx={{ objectFit: 'cover' }}
                        />
                        <CardContent sx={{ p: 2 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                            {product.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                            {product.description}
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Chip label={product.category} size="small" color="primary" variant="outlined" />
                            <Typography variant="body2" sx={{ color: '#666' }}>
                              Kod: {product.code}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1976d2' }}>
                              ₺{product.price.toLocaleString('tr-TR')}
                            </Typography>
                            <Box sx={{ textAlign: 'right' }}>
                              <Typography variant="body2" sx={{ color: '#666' }}>
                                Stok: {product.stockQuantity}
                              </Typography>
                              <LinearProgress 
                                variant="determinate" 
                                value={Math.min((product.stockQuantity / 100) * 100, 100)}
                                sx={{ width: 60, borderRadius: 2 }}
                                color={product.stockQuantity > 50 ? 'success' : product.stockQuantity > 20 ? 'warning' : 'error'}
                              />
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Box>
        )}
      </Box>
      
      <Footer />
    </Box>
  );
};

export default StoreDetailPage;
