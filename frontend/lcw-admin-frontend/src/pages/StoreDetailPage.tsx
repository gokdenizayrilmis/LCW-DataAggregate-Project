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
  // ADB: İçerik read-only, ekleme/düzenleme dialogları kaldırıldı
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

  // ADB: read-only, düzenleme devre dışı
  const handleEditEmployee = (_employee: Employee) => {};

  const handleSaveEmployee = async (_updatedEmployee: Employee) => {};

  const handleCancelEdit = () => {};

  const handleAddEmployee = () => {};

  const handleSaveNewEmployee = async () => {};

  const handleAddProduct = () => {};

  const handleSaveNewProduct = async () => {};

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


  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      bgcolor: '#f5f5f5'
    }}>
      <AdminNavbar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8, mb: 5 }}>
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
                         <Chip 
                           label={employee.position} 
                           color={
                             employee.position.includes('Müdür') ? 'error' :
                             employee.position.includes('Sorumlusu') ? 'warning' : 'default'
                           }
                           size="small"
                         />
                       </TableCell>
                       <TableCell>
                         {employee.salary.toLocaleString() + '₺'}
                       </TableCell>
                       <TableCell>{getWorkDuration(employee.hireDate)}</TableCell>
                       <TableCell>
                         {employee.phone}
                       </TableCell>
                                               <TableCell>
                          <IconButton size="small" color="primary">
                            <Visibility />
                          </IconButton>
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

      {/* ADB: İçerik CRUD dialogları kaldırıldı */}
     </Box>
   );
 };

export default StoreDetailPage;