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
  LinearProgress
} from '@mui/material';
import {
  Store as StoreIcon,
  Inventory2 as InventoryIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f5f5f5' }}>
        <Navbar />
        <Box sx={{ display: 'flex', flex: 1 }}>
          <Sidebar />
          <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Box sx={{ p: 3, flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Alert severity="error" sx={{ fontSize: '1.2rem' }}>
                {error}
              </Alert>
            </Box>
            <Footer />
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f5f5f5' }}>
      <Navbar 
        storeData={storeData ? {
          id: storeData.id,
          name: storeData.name,
          isActive: storeData.isActive
        } : undefined}
      />

      <Box sx={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Box sx={{ p: 3, flex: 1, mt: 2, mr: 2, overflowX: 'auto' }}>
        {/* Store Info Card - Mağaza Tanıtımı */}
        <Card sx={{ 
          mb: 3, 
          borderRadius: 3, 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 4px 20px rgba(102, 126, 234, 0.25)',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <Box sx={{ 
            position: 'absolute',
            top: 0,
            right: 0,
            width: '40%',
            height: '100%',
            background: 'radial-gradient(circle at top right, rgba(255,255,255,0.2) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />
          
          <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, mb: 3 }}>
              <Box sx={{ 
                bgcolor: 'rgba(255,255,255,0.25)',
                borderRadius: 3,
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <StoreIcon sx={{ fontSize: 56, color: 'white' }} />
              </Box>
              
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'white' }}>
                    {storeData?.name || 'Mağaza'}
                  </Typography>
                  <Chip 
                    label={storeData?.isActive ? 'Aktif' : 'Pasif'}
                    sx={{ 
                      bgcolor: storeData?.isActive ? 'rgba(76, 175, 80, 0.9)' : 'rgba(244, 67, 54, 0.9)',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      height: 32,
                      borderRadius: 2
                    }}
                  />
                </Box>
                <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.95)', fontWeight: 500, mb: 3 }}>
                  Mağaza Yönetim Paneli
                </Typography>
                
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, 
                  gap: 2 
                }}>
                  <Box sx={{ 
                    bgcolor: 'rgba(255,255,255,0.15)', 
                    backdropFilter: 'blur(10px)',
                    p: 2, 
                    borderRadius: 2,
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <LocationIcon sx={{ color: 'white', fontSize: 20 }} />
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600, textTransform: 'uppercase' }}>
                        Adres
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
                      {storeData?.address || 'Belirtilmemiş'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ 
                    bgcolor: 'rgba(255,255,255,0.15)', 
                    backdropFilter: 'blur(10px)',
                    p: 2, 
                    borderRadius: 2,
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <PhoneIcon sx={{ color: 'white', fontSize: 20 }} />
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600, textTransform: 'uppercase' }}>
                        Telefon
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
                      {storeData?.phone || 'Belirtilmemiş'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ 
                    bgcolor: 'rgba(255,255,255,0.15)', 
                    backdropFilter: 'blur(10px)',
                    p: 2, 
                    borderRadius: 2,
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <EmailIcon sx={{ color: 'white', fontSize: 20 }} />
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600, textTransform: 'uppercase' }}>
                        E-posta
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
                      {storeData?.email || 'Belirtilmemiş'}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Stats Cards - Modern & Soft Colors */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2.5, mb: 3 }}>
          <Card sx={{ 
            borderRadius: 2.5, 
            bgcolor: '#f0f7ff',
            border: '1px solid #d6e7ff',
            boxShadow: '0 2px 8px rgba(66, 133, 244, 0.08)'
          }}>
            <CardContent sx={{ textAlign: 'center', p: 2.5 }}>
              <Box sx={{ 
                bgcolor: '#4285f4',
                borderRadius: 2,
                width: 56,
                height: 56,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                mb: 1.5
              }}>
                <PeopleIcon sx={{ fontSize: 32, color: 'white' }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a73e8', mb: 0.5 }}>
                {employees.length}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#5f6368' }}>Çalışan</Typography>
            </CardContent>
          </Card>

          <Card sx={{ 
            borderRadius: 2.5, 
            bgcolor: '#fef7ff',
            border: '1px solid #f3e5f5',
            boxShadow: '0 2px 8px rgba(156, 39, 176, 0.08)'
          }}>
            <CardContent sx={{ textAlign: 'center', p: 2.5 }}>
              <Box sx={{ 
                bgcolor: '#9c27b0',
                borderRadius: 2,
                width: 56,
                height: 56,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                mb: 1.5
              }}>
                <InventoryIcon sx={{ fontSize: 32, color: 'white' }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#9c27b0', mb: 0.5 }}>
                {products.length}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#5f6368' }}>Ürün</Typography>
            </CardContent>
          </Card>

          <Card sx={{ 
            borderRadius: 2.5, 
            bgcolor: '#e8f5e9',
            border: '1px solid #c8e6c9',
            boxShadow: '0 2px 8px rgba(76, 175, 80, 0.08)'
          }}>
            <CardContent sx={{ textAlign: 'center', p: 2.5 }}>
              <Box sx={{ 
                bgcolor: '#4caf50',
                borderRadius: 2,
                width: 56,
                height: 56,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                mb: 1.5
              }}>
                <TrendingUpIcon sx={{ fontSize: 32, color: 'white' }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#2e7d32', mb: 0.5 }}>
                {storeData?.saleCount || 0}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#5f6368' }}>Satış</Typography>
            </CardContent>
          </Card>

          <Card sx={{ 
            borderRadius: 2.5, 
            bgcolor: '#fff8e1',
            border: '1px solid #ffecb3',
            boxShadow: '0 2px 8px rgba(255, 152, 0, 0.08)'
          }}>
            <CardContent sx={{ textAlign: 'center', p: 2.5 }}>
              <Box sx={{ 
                bgcolor: '#ff9800',
                borderRadius: 2,
                width: 56,
                height: 56,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                mb: 1.5
              }}>
                <StoreIcon sx={{ fontSize: 32, color: 'white' }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#ef6c00', mb: 0.5 }}>
                {storeData?.inventoryCount || 0}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#5f6368' }}>Stok</Typography>
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
          <Card sx={{ borderRadius: 3, bgcolor: 'white', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: '#1976d2' }}>
                Hoş Geldiniz! 👋
              </Typography>
              
              <Box sx={{ 
                bgcolor: '#f8f9fa',
                borderRadius: 2,
                p: 3,
                border: '1px solid #e9ecef'
              }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#495057' }}>
                  Mağaza Özeti
                </Typography>
                
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
                  <Box sx={{ 
                    bgcolor: 'white',
                    p: 2.5,
                    borderRadius: 2,
                    border: '1px solid #dee2e6'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                      <Box sx={{ 
                        bgcolor: '#e7f3ff',
                        borderRadius: 1.5,
                        p: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <PeopleIcon sx={{ color: '#1976d2', fontSize: 24 }} />
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#343a40' }}>
                        Çalışan Bilgisi
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ color: '#6c757d', pl: 5 }}>
                      {employees.length > 0 
                        ? `Mağazanızda ${employees.length} çalışan görev yapmaktadır.`
                        : 'Henüz çalışan eklenmemiş.'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ 
                    bgcolor: 'white',
                    p: 2.5,
                    borderRadius: 2,
                    border: '1px solid #dee2e6'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                      <Box sx={{ 
                        bgcolor: '#f3e5f5',
                        borderRadius: 1.5,
                        p: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <InventoryIcon sx={{ color: '#9c27b0', fontSize: 24 }} />
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#343a40' }}>
                        Ürün Bilgisi
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ color: '#6c757d', pl: 5 }}>
                      {products.length > 0 
                        ? `Toplamda ${products.length} ürün mevcut.`
                        : 'Henüz ürün eklenmemiş.'}
                    </Typography>
                  </Box>
                </Box>
              </Box>
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
                      boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
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
            {/* Ürünler */}
            <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: '#1976d2' }}>
                  Mağaza Ürünleri ({products.length} ürün)
                </Typography>
                
                {products.length === 0 ? (
                  <Alert severity="info">
                    Bu mağaza için henüz ürün bilgisi eklenmemiş.
                  </Alert>
                ) : (
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 2.5 }}>
                    {products.map((product) => (
                      <Card key={product.id} sx={{ 
                        borderRadius: 2,
                        boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
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
      </Box>
    </Box>
  );
};

export default StoreDetailPage;
