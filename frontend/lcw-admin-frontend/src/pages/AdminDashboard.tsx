import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Button
} from '@mui/material';
import {
  ViewList as ViewListIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  Inventory as InventoryIcon,
  LocalShipping as ShippingIcon
} from '@mui/icons-material';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { jwtDecode } from 'jwt-decode';
import AdminNavbar from '../components/AdminNavbar';
import Footer from '../components/Footer';
import CountUp from 'react-countup';

interface Store {
  id: number;
  name: string;
  isActive: boolean;
  isDomestic: boolean;
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
}

interface Product {
  id: number;
  name: string;
  code: string;
  category: string;
  price: number;
  imageUrl: string;
  description: string;
  stockQuantity: number;
}

//

const AdminDashboard: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  //
  // Dialoglar mağaza detay sayfasına taşındı
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const navigate = useNavigate();

  // Form states
  const [employeeForm, setEmployeeForm] = useState({
    name: '',
    surname: '',
    position: '',
    salary: '',
    email: '',
    phone: ''
  });

  const [productForm, setProductForm] = useState({
    name: '',
    code: '',
    category: '',
    price: '',
    description: '',
    stockQuantity: ''
  });

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

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');

      // Mağazaları yükle (kritik veri)
      const storesResponse = await fetch('http://localhost:5283/api/stores', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (storesResponse.ok) {
        const storesData = await storesResponse.json();
        setStores(storesData);
      } else {
        setError('Mağazalar yüklenemedi');
      }

      // Çalışanlar ve ürünler dashboard'da zorunlu değil; başarısız olursa hata göstermeyelim
      try {
        const employeesResponse = await fetch('http://localhost:5283/api/Employee', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (employeesResponse.ok) {
          const employeesData = await employeesResponse.json();
          setEmployees(employeesData);
        } else {
          setEmployees([]);
        }
      } catch {
        setEmployees([]);
      }

      try {
        const productsResponse = await fetch('http://localhost:5283/api/Product', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          setProducts(productsData);
        } else {
          setProducts([]);
        }
      } catch {
        setProducts([]);
      }
    } catch (error) {
      setError('Bağlantı hatası');
    } finally {
      setLoading(false);
    }
  };

  //

  const storeStats = {
    total: stores.length,
    domestic: stores.filter(s => s.isDomestic).length,
    international: stores.filter(s => !s.isDomestic).length,
  };

  const dashboardStats = {
    dailyRevenue: 1992798,
    monthlyRevenue: 36514532,
    soldProducts: 4734,
    stockCount: products.reduce((sum, p) => sum + p.stockQuantity, 0),
    employeeCount: employees.length
  };

  const pieData = [
    { name: 'Yurt İçi Mağazalar', value: storeStats.domestic, fill: '#4caf50' },
    { name: 'Yurt Dışı Mağazalar', value: storeStats.international, fill: '#f44336' },
  ];

  const getWorkDuration = (hireDate: string) => {
    const hire = new Date(hireDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - hire.getTime());
    const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
    const diffMonths = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
    
    if (diffYears > 0) {
      return `${diffYears} yıl ${diffMonths} ay`;
    }
    return `${diffMonths} ay`;
  };

  // Çalışan/Ürün ekleme işlemleri mağaza detay sayfasına taşındı

  const handleEditEmployee = (employee: Employee) => {};

  const handleSaveEmployee = async () => {};

  const handleAddProduct = () => {};

  const handleEditProduct = (product: Product) => {};

  const handleSaveProduct = async () => {};

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      bgcolor: '#f5f5f5'
    }}>
      <AdminNavbar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8, mb: 5 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
            Yönetim Paneli
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Mağaza performansını ve istatistiklerini takip et
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {/* İstatistik Kartları */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
          <Box sx={{ flex: '1 1 200px', minWidth: 200 }}>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #e3f0ff 0%, #f9f9f9 100%)',
                borderRadius: 3,
                boxShadow: 3,
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)' }
              }}
            >
              <MoneyIcon sx={{ fontSize: 48, color: '#4caf50', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Günlük Gelir
              </Typography>
              <Typography variant="h4">
                <CountUp end={dashboardStats.dailyRevenue} duration={1.2} separator="," />₺
              </Typography>
            </Paper>
          </Box>

          <Box sx={{ flex: '1 1 200px', minWidth: 200 }}>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #e3f0ff 0%, #f9f9f9 100%)',
                borderRadius: 3,
                boxShadow: 3,
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)' }
              }}
            >
              <MoneyIcon sx={{ fontSize: 48, color: '#1976d2', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Aylık Gelir
              </Typography>
              <Typography variant="h4">
                <CountUp end={dashboardStats.monthlyRevenue} duration={1.2} separator="," />₺
              </Typography>
            </Paper>
          </Box>

          <Box sx={{ flex: '1 1 200px', minWidth: 200 }}>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #e3f0ff 0%, #f9f9f9 100%)',
                borderRadius: 3,
                boxShadow: 3,
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)' }
              }}
            >
              <ShippingIcon sx={{ fontSize: 48, color: '#ff9800', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Satılan Ürün
              </Typography>
              <Typography variant="h4">
                <CountUp end={dashboardStats.soldProducts} duration={1.2} separator="," />
              </Typography>
            </Paper>
          </Box>

          <Box sx={{ flex: '1 1 200px', minWidth: 200 }}>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #e3f0ff 0%, #f9f9f9 100%)',
                borderRadius: 3,
                boxShadow: 3,
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)' }
              }}
            >
              <InventoryIcon sx={{ fontSize: 48, color: '#f44336', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Stok
              </Typography>
              <Typography variant="h4">
                <CountUp end={dashboardStats.stockCount} duration={1.2} separator="," />
              </Typography>
            </Paper>
          </Box>

          <Box sx={{ flex: '1 1 200px', minWidth: 200 }}>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #e3f0ff 0%, #f9f9f9 100%)',
                borderRadius: 3,
                boxShadow: 3,
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)' }
              }}
            >
              <PeopleIcon sx={{ fontSize: 48, color: '#1976d2', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Çalışanlar
              </Typography>
              <Typography variant="h4">
                <CountUp end={dashboardStats.employeeCount} duration={1.2} separator="," />
              </Typography>
            </Paper>
          </Box>
        </Box>

        {/* Mağaza Durumu ve Mağaza Listesi */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
          <Box sx={{ flex: '1 1 400px', minWidth: 400 }}>
            <Paper sx={{ p: 3, height: '100%', borderRadius: 3, boxShadow: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Mağaza Dağılımı
              </Typography>
              <Box sx={{ height: 300 }}>
                <PieChart width={400} height={300}>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </Box>
            </Paper>
          </Box>

          <Box sx={{ flex: '1 1 400px', minWidth: 400 }}>
            <Paper
              sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #e3f0ff 0%, #f9f9f9 100%)',
              }}
            >
              <ViewListIcon sx={{ fontSize: 64, color: '#1976d2', mb: 2 }} />
              <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
                Mağaza Listesi
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
                Tüm mağazaları görüntüle, düzenle ve yönet
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/stores')}
                startIcon={<ViewListIcon />}
              >
                Mağazaları Görüntüle
              </Button>
            </Paper>
          </Box>
        </Box>

        {/* Sekmeler kaldırıldı */}
      </Box>

      {/* Çalışan/Ürün ekleme işlemleri mağaza detay sayfasına taşındı */}

      <Footer />
    </Box>
  );
};

export default AdminDashboard;