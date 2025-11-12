import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import {
  Store as StoreIcon,
  People as PeopleIcon,
  Inventory as InventoryIcon,
  TrendingUp as TrendingUpIcon,
  ShowChart as ShowChartIcon,
  CalendarToday as CalendarTodayIcon,
  AttachMoney as AttachMoneyIcon,
} from '@mui/icons-material';
import { jwtDecode } from 'jwt-decode';
import AdminNavbar from '../components/AdminNavbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';

// Interfaces
interface Employee {
  id: number;
  name: string;
  surname: string;
  position: string;
  salary: number;
  hireDate: string;
  email: string;
  phone: string;
  storeId: number;
}

interface Product {
  id: number;
  name: string;
  code: string;
  category: string;
  price: number;
  stockQuantity: number;
  storeId: number;
}

interface Store {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  isActive: boolean;
  isDomestic: boolean;
  createdAt: string;
  updatedAt: string;
}

const AdminDashboard: React.FC = () => {
  // State management
  const [totalStores, setTotalStores] = useState(0);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
    const [recentStores, setRecentStores] = React.useState<Store[]>([]);
  const [salesSummary, setSalesSummary] = React.useState({
    todaySales: 0,
    weeklySales: 0,
    monthlySales: 0,
    totalSales: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // Authentication check
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || decoded["role"];
      if (role !== 'admin') {
        navigate('/');
        return;
      }
      fetchData();
    } catch (error) {
      console.error('Token decode error:', error);
      navigate('/');
    }
  }, [navigate]);

  // Fetch all data
  const fetchData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token bulunamadı');
        return;
      }

      // Fetch stores count
      const storesResponse = await fetch('http://localhost:5283/api/stores', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (storesResponse.ok) {
        const storesData = await storesResponse.json();
        setTotalStores(storesData.length);
        
        // Son 4 mağazayı al (en yeni eklenenleri)
      const sortedStores = storesData.sort((a: Store, b: Store) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setRecentStores(sortedStores.slice(0, 4));

      // Satış verilerini çek
      const salesResponse = await fetch('http://localhost:5283/api/Sale', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const salesData = await salesResponse.json();

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      const todaySales = salesData.filter((sale: any) => 
        new Date(sale.saleDate) >= today
      ).reduce((sum: number, sale: any) => sum + sale.totalAmount, 0);

      const weeklySales = salesData.filter((sale: any) => 
        new Date(sale.saleDate) >= weekAgo
      ).reduce((sum: number, sale: any) => sum + sale.totalAmount, 0);

      const monthlySales = salesData.filter((sale: any) => 
        new Date(sale.saleDate) >= monthAgo
      ).reduce((sum: number, sale: any) => sum + sale.totalAmount, 0);

      const totalSales = salesData.reduce((sum: number, sale: any) => sum + sale.totalAmount, 0);

      setSalesSummary({
        todaySales,
        weeklySales,
        monthlySales,
        totalSales
      });        console.log('✅ Stores loaded:', storesData.length);
      } else {
        setError('Mağazalar yüklenemedi');
        console.error('❌ Stores fetch failed:', storesResponse.status);
      }

      // Fetch employees
      try {
        const employeesResponse = await fetch('http://localhost:5283/api/Employee', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (employeesResponse.ok) {
          const employeesData = await employeesResponse.json();
          setEmployees(employeesData);
          console.log('✅ Employees loaded:', employeesData.length);
        }
      } catch (err) {
        console.warn('⚠️ Employees fetch failed:', err);
        setEmployees([]);
      }

      // Fetch products
      try {
        const productsResponse = await fetch('http://localhost:5283/api/Product', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          setProducts(productsData);
          console.log('✅ Products loaded:', productsData.length);
        }
      } catch (err) {
        console.warn('⚠️ Products fetch failed:', err);
        setProducts([]);
      }

    } catch (error) {
      console.error('❌ Fetch data error:', error);
      setError('Veri yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const stats = {
    totalStores,
    totalEmployees: employees.length,
    totalProducts: products.length,
    totalStock: products.reduce((sum, p) => sum + p.stockQuantity, 0)
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Veriler yükleniyor...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <AdminNavbar />
      <Box sx={{ display: 'flex', flex: 1, position: 'relative' }}>
        <Sidebar />
        
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ flexGrow: 1, p: 2, pl: 2, pt: 2, mt: 8 }}>
        {/* Header */}
        <Box sx={{ mb: 1.5 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 0.5 }}>
            Dashboard
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Hoş geldiniz, LCW Yönetim Paneline
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* İstatistikler - En Üstte */}
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
          Genel İstatistikler
        </Typography>
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 2,
          mb: 3
        }}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
            borderRadius: 2,
            boxShadow: 2,
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-4px)' }
          }}>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <StoreIcon sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                {stats.totalStores}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Toplam Mağaza
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ 
            background: 'linear-gradient(135deg, #e8f5e8 0%, #f1f8e9 100%)',
            borderRadius: 2,
            boxShadow: 2,
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-4px)' }
          }}>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <PeopleIcon sx={{ fontSize: 40, color: '#4caf50', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                {stats.totalEmployees}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Toplam Çalışan
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ 
            background: 'linear-gradient(135deg, #fff3e0 0%, #fce4ec 100%)',
            borderRadius: 2,
            boxShadow: 2,
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-4px)' }
          }}>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <InventoryIcon sx={{ fontSize: 40, color: '#ff9800', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
                {stats.totalProducts}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Toplam Ürün
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ 
            background: 'linear-gradient(135deg, #f3e5f5 0%, #e1f5fe 100%)',
            borderRadius: 2,
            boxShadow: 2,
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-4px)' }
          }}>
            <CardContent sx={{ textAlign: 'center', p: 2 }}>
              <TrendingUpIcon sx={{ fontSize: 40, color: '#9c27b0', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#9c27b0' }}>
                {stats.totalStock}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Toplam Stok
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Son Eklenen Mağazalar */}
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
          Son Eklenen Mağazalar
        </Typography>
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 2,
          mb: 3
        }}>
          {recentStores.length > 0 ? (
            recentStores.map((store) => (
              <Card key={store.id} sx={{ 
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': { 
                  transform: 'translateY(-4px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }
              }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <StoreIcon sx={{ color: '#1976d2', mr: 1, fontSize: 28 }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                      {store.name}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.85rem' }}>
                    {store.address.length > 50 ? store.address.substring(0, 50) + '...' : store.address}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        px: 1, 
                        py: 0.5, 
                        borderRadius: 1,
                        bgcolor: store.isActive ? '#e8f5e9' : '#ffebee',
                        color: store.isActive ? '#2e7d32' : '#c62828',
                        fontWeight: 600
                      }}
                    >
                      {store.isActive ? 'Aktif' : 'Pasif'}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        px: 1, 
                        py: 0.5, 
                        borderRadius: 1,
                        bgcolor: store.isDomestic ? '#e3f2fd' : '#f3e5f5',
                        color: store.isDomestic ? '#1565c0' : '#6a1b9a',
                        fontWeight: 600
                      }}
                    >
                      {store.isDomestic ? 'Yurt İçi' : 'Yurt Dışı'}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Eklenme: {new Date(store.createdAt).toLocaleDateString('tr-TR')}
                  </Typography>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card sx={{ 
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              gridColumn: '1 / -1'
            }}>
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <StoreIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                <Typography variant="body1" color="text.secondary">
                  Henüz mağaza eklenmemiş
                </Typography>
              </CardContent>
            </Card>
          )}
        </Box>

        {/* Satış Özeti */}
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
          Satış Özeti
        </Typography>
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 3,
          mb: 3
        }}>
          {/* Bugünkü Satış */}
          <Card sx={{ 
            borderRadius: 3,
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            background: 'white',
            border: '1px solid #f0f0f0',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            '&:hover': { 
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              borderColor: '#667eea'
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Box sx={{ 
                  bgcolor: '#f3f0ff', 
                  borderRadius: 2.5, 
                  p: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <TrendingUpIcon sx={{ color: '#667eea', fontSize: 28 }} />
                </Box>
                <Typography variant="caption" sx={{ 
                  color: '#667eea', 
                  bgcolor: '#f3f0ff',
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1.5,
                  fontWeight: 600,
                  fontSize: '0.75rem'
                }}>
                  Bugün
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#666', mb: 1, fontWeight: 500, fontSize: '0.9rem' }}>
                Bugünkü Satış
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a1a1a', mb: 0.5, fontSize: '1.75rem' }}>
                {salesSummary.todaySales.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
              </Typography>
              <Typography variant="caption" sx={{ color: '#999', fontSize: '0.8rem' }}>
                {new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
              </Typography>
            </CardContent>
          </Card>

          {/* Haftalık Satış */}
          <Card sx={{ 
            borderRadius: 3,
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            background: 'white',
            border: '1px solid #f0f0f0',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            '&:hover': { 
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              borderColor: '#f093fb'
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, #f093fb 0%, #f5576c 100%)'
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Box sx={{ 
                  bgcolor: '#fff0f6', 
                  borderRadius: 2.5, 
                  p: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <ShowChartIcon sx={{ color: '#f093fb', fontSize: 28 }} />
                </Box>
                <Typography variant="caption" sx={{ 
                  color: '#f093fb', 
                  bgcolor: '#fff0f6',
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1.5,
                  fontWeight: 600,
                  fontSize: '0.75rem'
                }}>
                  7 Gün
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#666', mb: 1, fontWeight: 500, fontSize: '0.9rem' }}>
                Haftalık Satış
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a1a1a', mb: 0.5, fontSize: '1.75rem' }}>
                {salesSummary.weeklySales.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
              </Typography>
              <Typography variant="caption" sx={{ color: '#999', fontSize: '0.8rem' }}>
                Son 7 günün toplamı
              </Typography>
            </CardContent>
          </Card>

          {/* Aylık Satış */}
          <Card sx={{ 
            borderRadius: 3,
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            background: 'white',
            border: '1px solid #f0f0f0',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            '&:hover': { 
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              borderColor: '#4facfe'
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)'
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Box sx={{ 
                  bgcolor: '#e8f5ff', 
                  borderRadius: 2.5, 
                  p: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <CalendarTodayIcon sx={{ color: '#4facfe', fontSize: 28 }} />
                </Box>
                <Typography variant="caption" sx={{ 
                  color: '#4facfe', 
                  bgcolor: '#e8f5ff',
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1.5,
                  fontWeight: 600,
                  fontSize: '0.75rem'
                }}>
                  30 Gün
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#666', mb: 1, fontWeight: 500, fontSize: '0.9rem' }}>
                Aylık Satış
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a1a1a', mb: 0.5, fontSize: '1.75rem' }}>
                {salesSummary.monthlySales.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
              </Typography>
              <Typography variant="caption" sx={{ color: '#999', fontSize: '0.8rem' }}>
                Son 30 günün toplamı
              </Typography>
            </CardContent>
          </Card>

          {/* Toplam Satış */}
          <Card sx={{ 
            borderRadius: 3,
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            background: 'white',
            border: '1px solid #f0f0f0',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            '&:hover': { 
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              borderColor: '#43e97b'
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)'
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Box sx={{ 
                  bgcolor: '#e8fff3', 
                  borderRadius: 2.5, 
                  p: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <AttachMoneyIcon sx={{ color: '#43e97b', fontSize: 28 }} />
                </Box>
                <Typography variant="caption" sx={{ 
                  color: '#43e97b', 
                  bgcolor: '#e8fff3',
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1.5,
                  fontWeight: 600,
                  fontSize: '0.75rem'
                }}>
                  Toplam
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#666', mb: 1, fontWeight: 500, fontSize: '0.9rem' }}>
                Toplam Satış
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a1a1a', mb: 0.5, fontSize: '1.75rem' }}>
                {salesSummary.totalSales.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
              </Typography>
              <Typography variant="caption" sx={{ color: '#999', fontSize: '0.8rem' }}>
                Tüm zamanların toplamı
              </Typography>
            </CardContent>
          </Card>
        </Box>
        </Box>
        </Box>
      </Box>
      
      <Footer />
    </Box>
  );
};

export default AdminDashboard;