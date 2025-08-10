import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  LinearProgress,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Store as StoreIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  Inventory as InventoryIcon,
  LocalShipping as ShippingIcon,
  TrendingUp,
  TrendingDown,
  Visibility,
  Edit,
  Delete
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import AdminNavbar from '../components/AdminNavbar';
import Footer from '../components/Footer';

// Random sınıfı için basit implementasyon
class Random {
  private seed: number;
  
  constructor(seed: number) {
    this.seed = seed;
  }
  
  Next(min: number, max: number): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    const random = this.seed / 233280;
    return Math.floor(random * (max - min + 1)) + min;
  }
}

interface StoreDetails {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  employeeCount: number;
  dailyRevenue: number;
  monthlyRevenue: number;
  soldProducts: number;
  stockCount: number;
  isActive: boolean;
  isDomestic: boolean;
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
  lastUpdated: string;
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

interface WeeklyReport {
  productName: string;
  quantity: number;
  revenue: number;
  percentage: number;
}

interface WeeklySale {
  id: number;
  storeId: number;
  weekNumber: number;
  weeklyRevenue: number;
  soldProducts: number;
  weekStartDate: string;
  weekEndDate: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`store-tabpanel-${index}`}
      aria-labelledby={`store-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const StoreDetailPage: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [storeDetails, setStoreDetails] = useState<StoreDetails | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [openProductModal, setOpenProductModal] = useState(false);
  const [openEmployeeDialog, setOpenEmployeeDialog] = useState(false);
  const [openProductDialog, setOpenProductDialog] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);

  // State for dynamic data
  const [products, setProducts] = useState<Product[]>([]);
  const [weeklyReport, setWeeklyReport] = useState<WeeklyReport[]>([]);
  const [weeklySales, setWeeklySales] = useState<WeeklySale[]>([]);

  // Forms for add dialogs
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
  const [productImageFile, setProductImageFile] = useState<File | null>(null);
  const [productImagePreview, setProductImagePreview] = useState<string>('');

  // Haftalık satış verilerini grafik için hazırla
  const weeklySalesData = weeklySales.length > 0 ? weeklySales.map(sale => ({
    name: `${sale.weekNumber}. Hafta`,
    revenue: sale.weeklyRevenue,
    products: sale.soldProducts
  })) : [];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getWorkDuration = (hireDate: string) => {
    const hire = new Date(hireDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - hire.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    return `${years} yıl ${months} ay`;
  };

  const getStockStatus = (quantity: number) => {
    if (quantity > 100) return { status: 'Yüksek', color: 'success' };
    if (quantity > 50) return { status: 'Orta', color: 'warning' };
    return { status: 'Düşük', color: 'error' };
  };

  const handleProductView = (product: Product) => {
    setSelectedProduct(product);
    setOpenProductModal(true);
  };

  const handleCloseProductModal = () => {
    setOpenProductModal(false);
    setSelectedProduct(null);
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
  };

  const handleSaveEmployee = async (updatedEmployee: Employee) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5283/api/Employee/${updatedEmployee.id}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedEmployee)
      });

      if (response.ok) {
        setEmployees(prev => prev.map(emp => 
          emp.id === updatedEmployee.id ? updatedEmployee : emp
        ));
        setEditingEmployee(null);
      } else {
        console.error('Çalışan güncellenirken hata oluştu');
      }
    } catch (error) {
      console.error('Çalışan güncellenirken hata:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingEmployee(null);
  };

  const handleAddEmployee = () => {
    setEmployeeForm({ name: '', surname: '', position: '', salary: '', email: '', phone: '' });
    setOpenEmployeeDialog(true);
  };

  const handleSaveNewEmployee = async () => {
    try {
      const token = localStorage.getItem('token');
      const payload = {
        name: employeeForm.name,
        surname: employeeForm.surname,
        position: employeeForm.position,
        salary: parseFloat(employeeForm.salary),
        hireDate: new Date().toISOString(),
        email: employeeForm.email,
        phone: employeeForm.phone,
        avatar: '',
        storeId: parseInt(storeId || '0'),
        isActive: true
      };
      const response = await fetch('http://localhost:5283/api/Employee', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        // refresh employees
        const headers = { 'Authorization': `Bearer ${token}` } as any;
        const employeesResponse = await fetch(`http://localhost:5283/api/Employee/store/${storeId}`, { headers });
        if (employeesResponse.ok) {
          const employeesData = await employeesResponse.json();
          setEmployees(employeesData);
        }
        setOpenEmployeeDialog(false);
      }
    } catch (e) {
      console.error('Yeni çalışan eklenemedi:', e);
    }
  };

  const handleAddProduct = () => {
    setProductForm({ name: '', code: '', category: '', price: '', description: '', stockQuantity: '' });
    setProductImageFile(null);
    setProductImagePreview('');
    setOpenProductDialog(true);
  };

  const handleSaveNewProduct = async () => {
    try {
      const token = localStorage.getItem('token');
      let imageUrl = '';

      // Upload image first if selected
      if (productImageFile) {
        const formData = new FormData();
        formData.append('file', productImageFile);
        formData.append('storeId', String(parseInt(storeId || '0')));
        formData.append('category', productForm.category || 'Genel');
        const uploadRes = await fetch('http://localhost:5283/api/uploads/product-image', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        });
        if (uploadRes.ok) {
          const data = await uploadRes.json();
          imageUrl = data.imageUrl;
        }
      }

      const payload = {
        name: productForm.name,
        code: productForm.code,
        category: productForm.category,
        price: parseFloat(productForm.price),
        imageUrl: imageUrl || `/images/products/${(productForm.category || 'genel').toLowerCase()}/default.jpg`,
        description: productForm.description,
        stockQuantity: parseInt(productForm.stockQuantity),
        storeId: parseInt(storeId || '0'),
        isActive: true
      };
      const response = await fetch('http://localhost:5283/api/Product', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        // refresh products
        const headers = { 'Authorization': `Bearer ${token}` } as any;
        const productsResponse = await fetch(`http://localhost:5283/api/Product/store/${storeId}`, { headers });
        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          setProducts(productsData);
        }
        setOpenProductDialog(false);
      }
    } catch (e) {
      console.error('Yeni ürün eklenemedi:', e);
    }
  };

  const handleDeleteEmployee = async (employeeId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5283/api/Employee/${employeeId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
      } else {
        console.error('Çalışan silinirken hata oluştu');
      }
    } catch (error) {
      console.error('Çalışan silinirken hata:', error);
    }
  };

  // Random finansal veriler oluştur
  const generateFinancialData = (storeId: string) => {
    const seed = parseInt(storeId) || 1;
    const random = new Random(seed);
    
    // Günlük gelir: 1.000.000 - 4.000.000 TL arası
    const dailyRevenue = random.Next(1000000, 4000000);
    
    // Aylık gelir: 30.000.000 - 60.000.000 TL arası
    const monthlyRevenue = random.Next(30000000, 60000000);
    
    // Ayın başından itibaren satılan ürün sayısı
    const currentDay = new Date().getDate();
    const soldProducts = random.Next(currentDay * 100, currentDay * 500);
    
    return { dailyRevenue, monthlyRevenue, soldProducts };
  };

  const financialData = generateFinancialData(storeId || '1');

  // API çağrıları
  useEffect(() => {
    const fetchData = async () => {
      if (!storeId) return;
      
      try {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        // Ürünleri getir
        console.log('Fetching products for store:', storeId);
        const productsResponse = await fetch(`http://localhost:5283/api/Product/store/${storeId}`, { headers });
        console.log('Products response status:', productsResponse.status);
        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          console.log('Fetched products:', productsData);
          setProducts(productsData);
          
          // Haftalık rapor oluştur (ürünlerden hesapla)
          if (productsData.length > 0) {
            const report = productsData.slice(0, 6).map((product: any, index: number) => ({
              productName: product.name,
              quantity: Math.floor(Math.random() * 50) + 10,
              revenue: product.price * (Math.floor(Math.random() * 50) + 10),
              percentage: Math.floor(Math.random() * 30) + 5
            }));
            setWeeklyReport(report);
          }
        } else {
          console.error('Products response not ok:', productsResponse.status);
        }

                 // Çalışanları getir
         console.log('Fetching employees for store:', storeId);
         const employeesResponse = await fetch(`http://localhost:5283/api/Employee/store/${storeId}`, { headers });
         console.log('Employees response status:', employeesResponse.status);
         if (employeesResponse.ok) {
           const employeesData = await employeesResponse.json();
           console.log('Fetched employees:', employeesData);
           setEmployees(employeesData);
         } else {
           console.error('Employees response not ok:', employeesResponse.status);
         }

         // Haftalık satış verilerini getir
         console.log('Fetching weekly sales for store:', storeId);
         const weeklySalesResponse = await fetch(`http://localhost:5283/api/WeeklySale/store/${storeId}`, { headers });
         console.log('Weekly sales response status:', weeklySalesResponse.status);
         if (weeklySalesResponse.ok) {
           const weeklySalesData = await weeklySalesResponse.json();
           console.log('Fetched weekly sales:', weeklySalesData);
           setWeeklySales(weeklySalesData);
         } else {
           console.error('Weekly sales response not ok:', weeklySalesResponse.status);
         }
      } catch (error) {
        console.error('Veri yüklenirken hata:', error);
      }
    };

    fetchData();
  }, [storeId]);

  useEffect(() => {
    const fetchStoreDetails = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5283/api/stores/${storeId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          setStoreDetails({
            ...data,
            employeeCount: employees.length,
            dailyRevenue: financialData.dailyRevenue,
            monthlyRevenue: financialData.monthlyRevenue,
            soldProducts: financialData.soldProducts,
            stockCount: products.reduce((sum, product) => sum + product.stockQuantity, 0)
          });
        } else {
          setError('Mağaza detayları yüklenirken hata oluştu');
        }
      } catch (error) {
        setError('Bağlantı hatası');
      } finally {
        setLoading(false);
      }
    };

    fetchStoreDetails();
  }, [storeId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!storeDetails) {
    return (
      <Box p={3}>
        <Alert severity="error">Mağaza bulunamadı</Alert>
      </Box>
    );
  }

     // Debug bilgileri
   console.log('Current state - products:', products.length, 'employees:', employees.length, 'weeklyReport:', weeklyReport.length, 'weeklySales:', weeklySales.length);

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      bgcolor: '#f5f5f5'
    }}>
      <AdminNavbar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8, mb: 5 }}>
        {/* Debug bilgisi */}
                 <Alert severity="info" sx={{ mb: 2 }}>
           Debug: {products.length} ürün, {employees.length} çalışan, {weeklySales.length} haftalık satış yüklendi
         </Alert>
        {/* Mağaza Başlığı */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
              {storeDetails.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              {storeDetails.address}
            </Typography>
          </Box>
          
          {/* Aylık Rapor İncele Butonu */}
          <Button
            variant="contained"
            startIcon={<TrendingUp />}
            sx={{
              background: 'linear-gradient(45deg, #ff9800 30%, #ffb74d 90%)',
              boxShadow: '0 3px 5px 2px rgba(255, 152, 0, .3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #f57c00 30%, #ff9800 90%)',
              },
              fontWeight: 'bold'
            }}
            onClick={() => {
              // Aylık rapor sekmesine git
              setTabValue(1);
            }}
          >
            Aylık Rapor İncele
          </Button>
        </Box>
        {/* Mağaza Durumu ve Türü */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Chip
            label={storeDetails.isActive ? 'Aktif' : 'Pasif'}
            color={storeDetails.isActive ? 'success' : 'error'}
            sx={{ fontWeight: 'bold' }}
          />
          <Chip
            label={storeDetails.isDomestic ? 'Yurt İçi' : 'Yurt Dışı'}
            color={storeDetails.isDomestic ? 'primary' : 'secondary'}
            sx={{ fontWeight: 'bold' }}
          />
        </Box>

        {/* İstatistik Kartları */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
          <Box sx={{ flex: '1 1 200px', minWidth: 200 }}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #e3f0ff 0%, #f9f9f9 100%)',
              borderRadius: 2,
              boxShadow: 3,
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)' }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PeopleIcon sx={{ fontSize: 40, color: '#1976d2', mr: 1 }} />
                  <Typography variant="h6">Çalışanlar</Typography>
                </Box>
                <Typography variant="h4">{storeDetails.employeeCount}</Typography>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ flex: '1 1 200px', minWidth: 200 }}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #e3f0ff 0%, #f9f9f9 100%)',
              borderRadius: 2,
              boxShadow: 3,
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)' }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <MoneyIcon sx={{ fontSize: 40, color: '#4caf50', mr: 1 }} />
                  <Typography variant="h6">Günlük Gelir</Typography>
                </Box>
                <Typography variant="h4">{storeDetails.dailyRevenue.toLocaleString()}₺</Typography>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ flex: '1 1 200px', minWidth: 200 }}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #e3f0ff 0%, #f9f9f9 100%)',
              borderRadius: 2,
              boxShadow: 3,
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)' }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <MoneyIcon sx={{ fontSize: 40, color: '#2196f3', mr: 1 }} />
                  <Typography variant="h6">Aylık Gelir</Typography>
                </Box>
                <Typography variant="h4">{storeDetails.monthlyRevenue.toLocaleString()}₺</Typography>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ flex: '1 1 200px', minWidth: 200 }}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #e3f0ff 0%, #f9f9f9 100%)',
              borderRadius: 2,
              boxShadow: 3,
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)' }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ShippingIcon sx={{ fontSize: 40, color: '#ff9800', mr: 1 }} />
                  <Typography variant="h6">Satılan Ürün</Typography>
                </Box>
                <Typography variant="h4">{storeDetails.soldProducts}</Typography>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ flex: '1 1 200px', minWidth: 200 }}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #e3f0ff 0%, #f9f9f9 100%)',
              borderRadius: 2,
              boxShadow: 3,
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)' }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <InventoryIcon sx={{ fontSize: 40, color: '#f44336', mr: 1 }} />
                  <Typography variant="h6">Stok</Typography>
                </Box>
                <Typography variant="h4">{storeDetails.stockCount}</Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Sekmeler */}
        <Paper sx={{ width: '100%', mb: 4 }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="store tabs">
            <Tab label="Satış Grafikleri" />
            <Tab label="Stok Durumu" />
            <Tab label="Ürünler" />
            <Tab label="Çalışanlar" />
            <Tab label="Raporlar" />
          </Tabs>

          {/* Sekme İçerikleri */}
                               <TabPanel value={tabValue} index={0}>
            <Paper sx={{ p: 3, height: 400 }}>
              <Typography variant="h6" gutterBottom>Haftalık Satış Grafiği</Typography>
              {weeklySalesData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklySalesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip formatter={(value) => `${value.toLocaleString()}₺`} />
                      <Legend />
                      <Bar dataKey="revenue" fill="#8884d8" name="Haftalık Gelir (₺)" />
                    </BarChart>
                  </ResponsiveContainer>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Bu ayın 4 haftalık satış verileri gösterilmektedir. Toplam aylık gelir: {financialData.monthlyRevenue.toLocaleString()}₺
                    </Typography>
                  </Box>
                </>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <Typography variant="body1" color="text.secondary">
                    Haftalık satış verileri yükleniyor...
                  </Typography>
                </Box>
              )}
            </Paper>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Stok Durumu</Typography>
              <Button variant="contained" onClick={handleAddProduct}>Yeni Ürün Ekle</Button>
            </Box>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Ürün</TableCell>
                    <TableCell>Kod</TableCell>
                    <TableCell>Kategori</TableCell>
                    <TableCell>Stok Miktarı</TableCell>
                    <TableCell>Durum</TableCell>
                    <TableCell>Son Güncelleme</TableCell>
                    <TableCell>İşlemler</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                                     {products.map((product) => {
                    const stockStatus = getStockStatus(product.stockQuantity);
                    return (
                      <TableRow key={product.id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar 
                              src={`${window.location.origin}${product.imageUrl}`} 
                              sx={{ width: 40, height: 40, mr: 2 }}
                            />
                            <Typography variant="body2">{product.name}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{product.code}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{product.stockQuantity}</TableCell>
                        <TableCell>
                          <Chip 
                            label={stockStatus.status} 
                            color={stockStatus.color as any}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{product.lastUpdated}</TableCell>
                                                 <TableCell>
                           <IconButton 
                             size="small" 
                             color="primary"
                             onClick={() => handleProductView(product)}
                           >
                             <Visibility />
                           </IconButton>
                           <IconButton size="small" color="secondary">
                             <Edit />
                           </IconButton>
                         </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Ürünler</Typography>
              <Button variant="contained" onClick={handleAddProduct}>Yeni Ürün Ekle</Button>
            </Box>
                         <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
               {products.map((product) => (
                <Box key={product.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ position: 'relative' }}>
                                                                 <img 
                        src={`${window.location.origin}${product.imageUrl}`} 
                        alt={product.name}
                        style={{ 
                          width: '100%', 
                          height: 250, 
                          objectFit: 'contain',
                          backgroundColor: '#f5f5f5'
                        }}
                      />
                      <Chip 
                        label={`${product.stockQuantity} adet`}
                        color={getStockStatus(product.stockQuantity).color as any}
                        size="small"
                        sx={{ 
                          position: 'absolute', 
                          top: 8, 
                          right: 8 
                        }}
                      />
                    </Box>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        {product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {product.description}
                      </Typography>
                      <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                        {product.price.toLocaleString()}₺
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Kod: {product.code}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Çalışanlar</Typography>
              <Button variant="contained" onClick={handleAddEmployee}>Yeni Çalışan Ekle</Button>
            </Box>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Çalışan</TableCell>
                    <TableCell>Pozisyon</TableCell>
                    <TableCell>Maaş</TableCell>
                    <TableCell>Çalışma Süresi</TableCell>
                    <TableCell>İletişim</TableCell>
                    <TableCell>İşlemler</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                                     {employees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar 
                            src={employee.avatar} 
                            sx={{ width: 40, height: 40, mr: 2 }}
                          />
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {employee.name} {employee.surname}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {employee.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                                             <TableCell>
                         {editingEmployee?.id === employee.id ? (
                           <input
                             value={editingEmployee.position}
                             onChange={(e) => setEditingEmployee(prev => prev ? {...prev, position: e.target.value} : null)}
                             style={{ padding: '4px 8px', border: '1px solid #ccc', borderRadius: '4px' }}
                           />
                         ) : (
                           <Chip 
                             label={employee.position} 
                             color={
                               employee.position.includes('Müdür') ? 'error' :
                               employee.position.includes('Sorumlusu') ? 'warning' : 'default'
                             }
                             size="small"
                           />
                         )}
                       </TableCell>
                       <TableCell>
                         {editingEmployee?.id === employee.id ? (
                           <input
                             type="number"
                             value={editingEmployee.salary}
                             onChange={(e) => setEditingEmployee(prev => prev ? {...prev, salary: parseInt(e.target.value) || 0} : null)}
                             style={{ padding: '4px 8px', border: '1px solid #ccc', borderRadius: '4px', width: '80px' }}
                           />
                         ) : (
                           employee.salary.toLocaleString() + '₺'
                         )}
                       </TableCell>
                       <TableCell>{getWorkDuration(employee.hireDate)}</TableCell>
                       <TableCell>
                         {editingEmployee?.id === employee.id ? (
                           <input
                             value={editingEmployee.phone}
                             onChange={(e) => setEditingEmployee(prev => prev ? {...prev, phone: e.target.value} : null)}
                             style={{ padding: '4px 8px', border: '1px solid #ccc', borderRadius: '4px' }}
                           />
                         ) : (
                           employee.phone
                         )}
                       </TableCell>
                                               <TableCell>
                          {editingEmployee?.id === employee.id ? (
                            <>
                              <IconButton size="small" color="success" onClick={() => handleSaveEmployee(editingEmployee)}>
                                <Edit />
                              </IconButton>
                              <IconButton size="small" color="error" onClick={handleCancelEdit}>
                                <Delete />
                              </IconButton>
                            </>
                          ) : (
                            <>
                              <IconButton size="small" color="primary">
                                <Visibility />
                              </IconButton>
                              <IconButton size="small" color="secondary" onClick={() => handleEditEmployee(employee)}>
                                <Edit />
                              </IconButton>
                              <IconButton size="small" color="error" onClick={() => handleDeleteEmployee(employee.id)}>
                                <Delete />
                              </IconButton>
                            </>
                          )}
                        </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          <TabPanel value={tabValue} index={4}>
            <Typography variant="h6" gutterBottom>Haftalık Satış Raporu</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3 }}>
              <Box>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Ürün</TableCell>
                        <TableCell>Satış Adedi</TableCell>
                        <TableCell>Gelir</TableCell>
                        <TableCell>Yüzde</TableCell>
                        <TableCell>İlerleme</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {weeklyReport.map((report, index) => (
                        <TableRow key={index}>
                          <TableCell>{report.productName}</TableCell>
                          <TableCell>{report.quantity}</TableCell>
                          <TableCell>{report.revenue.toLocaleString()}₺</TableCell>
                          <TableCell>{report.percentage}%</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Box sx={{ width: '100%', mr: 1 }}>
                                <LinearProgress 
                                  variant="determinate" 
                                  value={report.percentage} 
                                  sx={{ height: 8, borderRadius: 5 }}
                                />
                              </Box>
                              <Box sx={{ minWidth: 35 }}>
                                <Typography variant="body2" color="text.secondary">
                                  {report.percentage}%
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
              <Box>
                <Card sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>Özet</Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Toplam Satış
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                             {weeklyReport.reduce((sum, report) => sum + report.quantity, 0)} adet
                    </Typography>
                  </Box>
                                     <Box sx={{ mb: 2 }}>
                     <Typography variant="body2" color="text.secondary">
                       Günlük Gelir
                     </Typography>
                     <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                       {financialData.dailyRevenue.toLocaleString()}₺
                     </Typography>
                   </Box>
                                     <Box sx={{ mb: 2 }}>
                     <Typography variant="body2" color="text.secondary">
                       Aylık Toplam Satış
                     </Typography>
                     <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'info.main' }}>
                       {financialData.soldProducts.toLocaleString()} adet
                     </Typography>
                   </Box>
                   <Box>
                     <Typography variant="body2" color="text.secondary">
                       Ortalama Satış
                     </Typography>
                     <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                       {Math.round(weeklyReport.reduce((sum, report) => sum + report.quantity, 0) / weeklyReport.length)} adet/gün
                     </Typography>
                   </Box>
                </Card>
              </Box>
            </Box>
          </TabPanel>
        </Paper>
             </Box>
       <Footer />

       {/* Ürün Detay Modal */}
       <Dialog
         open={openProductModal}
         onClose={handleCloseProductModal}
         maxWidth="md"
         fullWidth
       >
         <DialogTitle>
           {selectedProduct?.name}
         </DialogTitle>
         <DialogContent>
           {selectedProduct && (
             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
               <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                   <img 
                    src={`${window.location.origin}${selectedProduct.imageUrl}`} 
                    alt={selectedProduct.name}
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '400px', 
                      objectFit: 'contain' 
                    }}
                  />
               </Box>
               <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                 <Typography variant="body1">
                   <strong>Kod:</strong> {selectedProduct.code}
                 </Typography>
                 <Typography variant="body1">
                   <strong>Kategori:</strong> {selectedProduct.category}
                 </Typography>
                 <Typography variant="body1">
                   <strong>Fiyat:</strong> {selectedProduct.price.toLocaleString()}₺
                 </Typography>
                 <Typography variant="body1">
                   <strong>Stok:</strong> {selectedProduct.stockQuantity} adet
                 </Typography>
                 <Typography variant="body1">
                   <strong>Son Güncelleme:</strong> {selectedProduct.lastUpdated}
                 </Typography>
                 <Typography variant="body1">
                   <strong>Durum:</strong> 
                   <Chip 
                     label={getStockStatus(selectedProduct.stockQuantity).status} 
                     color={getStockStatus(selectedProduct.stockQuantity).color as any}
                     size="small"
                     sx={{ ml: 1 }}
                   />
                 </Typography>
               </Box>
               <Typography variant="body1" sx={{ mt: 2 }}>
                 <strong>Açıklama:</strong> {selectedProduct.description}
               </Typography>
             </Box>
           )}
         </DialogContent>
         <DialogActions>
           <Button onClick={handleCloseProductModal} color="primary">
             Kapat
           </Button>
         </DialogActions>
       </Dialog>

      {/* Yeni Çalışan Ekle Dialog */}
      <Dialog open={openEmployeeDialog} onClose={() => setOpenEmployeeDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Yeni Çalışan Ekle</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mt: 1 }}>
            <TextField label="Ad" value={employeeForm.name} onChange={(e) => setEmployeeForm({ ...employeeForm, name: e.target.value })} fullWidth />
            <TextField label="Soyad" value={employeeForm.surname} onChange={(e) => setEmployeeForm({ ...employeeForm, surname: e.target.value })} fullWidth />
            <TextField label="Pozisyon" value={employeeForm.position} onChange={(e) => setEmployeeForm({ ...employeeForm, position: e.target.value })} fullWidth />
            <TextField label="Maaş" type="number" value={employeeForm.salary} onChange={(e) => setEmployeeForm({ ...employeeForm, salary: e.target.value })} fullWidth />
            <TextField label="E-posta" type="email" value={employeeForm.email} onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.target.value })} fullWidth />
            <TextField label="Telefon" value={employeeForm.phone} onChange={(e) => setEmployeeForm({ ...employeeForm, phone: e.target.value })} fullWidth />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEmployeeDialog(false)}>İptal</Button>
          <Button onClick={handleSaveNewEmployee} variant="contained">Ekle</Button>
        </DialogActions>
      </Dialog>

      {/* Yeni Ürün Ekle Dialog */}
      <Dialog open={openProductDialog} onClose={() => setOpenProductDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Yeni Ürün Ekle</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField label="Ürün Adı" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} fullWidth />
            <TextField label="Ürün Kodu" value={productForm.code} onChange={(e) => setProductForm({ ...productForm, code: e.target.value })} fullWidth />
            <FormControl fullWidth>
              <InputLabel>Kategori</InputLabel>
              <Select value={productForm.category} label="Kategori" onChange={(e) => setProductForm({ ...productForm, category: e.target.value as string })}>
                <MenuItem value="Tişört">Tişört</MenuItem>
                <MenuItem value="Pantolon">Pantolon</MenuItem>
                <MenuItem value="Ayakkabı">Ayakkabı</MenuItem>
                <MenuItem value="Hırka">Hırka</MenuItem>
                <MenuItem value="Gömlek">Gömlek</MenuItem>
                <MenuItem value="Şort">Şort</MenuItem>
              </Select>
            </FormControl>
            <TextField label="Fiyat" type="number" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} fullWidth />
            <TextField label="Açıklama" value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} fullWidth multiline rows={3} />
            <TextField label="Stok Miktarı" type="number" value={productForm.stockQuantity} onChange={(e) => setProductForm({ ...productForm, stockQuantity: e.target.value })} fullWidth />
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Ürün Görseli</Typography>
              {productImagePreview && (
                <Box sx={{ mb: 1 }}>
                  <img src={productImagePreview} alt="Önizleme" style={{ maxWidth: '100%', maxHeight: 200, objectFit: 'contain', border: '1px solid #eee', borderRadius: 8 }} />
                </Box>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setProductImageFile(file);
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = () => setProductImagePreview(reader.result as string);
                    reader.readAsDataURL(file);
                  } else {
                    setProductImagePreview('');
                  }
                }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenProductDialog(false)}>İptal</Button>
          <Button onClick={handleSaveNewProduct} variant="contained">Ekle</Button>
        </DialogActions>
      </Dialog>
     </Box>
   );
 };

export default StoreDetailPage;