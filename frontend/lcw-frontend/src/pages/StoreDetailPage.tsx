import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Alert,
  CircularProgress,
  Button,
  Avatar,
  Tab,
  Tabs,
  CardMedia,
  Paper,
  Divider,
  LinearProgress,
  TextField,
  InputAdornment,

  IconButton,
  Tooltip,
  Badge,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Rating,
  Fade,
  Zoom,
  Slide,
  Grow
} from '@mui/material';
import {
  Store as StoreIcon,
  Inventory2 as InventoryIcon,
  TrendingUp as TrendingUpIcon,
  Search as SearchIcon,
  People as PeopleIcon,
  ShoppingBag as ShoppingBagIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  FilterList as FilterIcon,
  ExpandMore as ExpandMoreIcon,
  Star as StarIcon,
  Visibility as VisibilityIcon,
  Favorite as FavoriteIcon,
  ShoppingCart as ShoppingCartIcon,
  Assessment as AssessmentIcon,
  Timeline as TimelineIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  ShowChart as ShowChartIcon,
  TrendingDown as TrendingDownIcon,
  AttachMoney as AttachMoneyIcon,
  LocalOffer as LocalOfferIcon,
  Category as CategoryIcon,
  Business as BusinessIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon
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
  performance?: number;
  salesCount?: number;
  customerRating?: number;
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
  brand?: string;
  size?: string;
  color?: string;
  discount?: number;
  rating?: number;
  reviewCount?: number;
}

interface WeeklySale {
  id: number;
  storeId: number;
  weekNumber: number;
  weeklyRevenue: number;
  soldProducts: number;
  weekStartDate: string;
  weekEndDate: string;
  isActive: boolean;
  profit?: number;
  customerCount?: number;
}

interface Sale {
  id: number;
  storeId: number;
  productId: number;
  quantity: number;
  totalPrice: number;
  saleDate: string;
  customerName?: string;
  paymentMethod?: string;
  isActive: boolean;
}

interface CategoryStats {
  category: string;
  productCount: number;
  totalRevenue: number;
  averagePrice: number;
}

const StoreDetailPage: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const [storeData, setStoreData] = useState<StoreData | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [weeklySales, setWeeklySales] = useState<WeeklySale[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentTab, setCurrentTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');



  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/';
      return;
    }

    fetchStoreData();
  }, [storeId]);

  useEffect(() => {
    if (products.length > 0) {
      let filtered = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
      });

      // Sorting
      filtered.sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'price-low':
            return a.price - b.price;
          case 'price-high':
            return b.price - a.price;
          case 'stock':
            return b.stockQuantity - a.stockQuantity;
          case 'category':
            return a.category.localeCompare(b.category);
          default:
            return 0;
        }
      });

      setFilteredProducts(filtered);
    }
  }, [searchTerm, products, selectedCategory, sortBy]);

  const fetchStoreData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      console.log('Fetching store data for store ID:', storeId);
      console.log('Token:', token ? 'Present' : 'Missing');
      
      // Paralel API çağrıları
      const [storeResponse, employeesResponse, productsResponse, salesResponse, weeklySalesResponse] = await Promise.all([
        fetch(`http://localhost:5283/api/stores/${storeId}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`http://localhost:5283/api/Employee/store/${storeId}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`http://localhost:5283/api/Product/store/${storeId}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`http://localhost:5283/api/Sale/store/${storeId}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`http://localhost:5283/api/WeeklySale/store/${storeId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      console.log('API Responses:');
      console.log('Store Response:', storeResponse.status, storeResponse.ok);
      console.log('Employees Response:', employeesResponse.status, employeesResponse.ok);
      console.log('Products Response:', productsResponse.status, productsResponse.ok);
      console.log('Sales Response:', salesResponse.status, salesResponse.ok);
      console.log('WeeklySales Response:', weeklySalesResponse.status, weeklySalesResponse.ok);

      if (storeResponse.ok) {
        const storeData = await storeResponse.json();
        console.log('Store Data:', storeData);
        setStoreData(storeData);
      } else {
        console.error('Store API Error:', storeResponse.status, storeResponse.statusText);
      }

      if (employeesResponse.ok) {
        const employeesData = await employeesResponse.json();
        console.log('Employees Data:', employeesData);
        setEmployees(employeesData);
      } else {
        console.error('Employees API Error:', employeesResponse.status, employeesResponse.statusText);
      }

      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        console.log('Products Data:', productsData);
        setProducts(productsData);
      } else {
        console.error('Products API Error:', productsResponse.status, productsResponse.statusText);
      }

      if (salesResponse.ok) {
        const salesData = await salesResponse.json();
        console.log('Sales Data:', salesData);
        setSales(salesData);
      } else {
        console.error('Sales API Error:', salesResponse.status, salesResponse.statusText);
      }

      if (weeklySalesResponse.ok) {
        const weeklySalesData = await weeklySalesResponse.json();
        console.log('WeeklySales Data:', weeklySalesData);
        setWeeklySales(weeklySalesData);
      } else {
        console.error('WeeklySales API Error:', weeklySalesResponse.status, weeklySalesResponse.statusText);
      }

    } catch (error) {
      setError('Veri yükleme hatası');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const getTotalRevenue = () => {
    if (!weeklySales || weeklySales.length === 0) return 0;
    return weeklySales.reduce((total, sale) => total + (sale.weeklyRevenue || 0), 0);
  };

  const getTotalSoldProducts = () => {
    if (!weeklySales || weeklySales.length === 0) return 0;
    return weeklySales.reduce((total, sale) => total + (sale.soldProducts || 0), 0);
  };

  const getCategoryStats = () => {
    const stats = new Map<string, { productCount: number; totalRevenue: number; totalPrice: number }>();
    
    products.forEach(product => {
      const category = product.category;
      if (!stats.has(category)) {
        stats.set(category, { productCount: 0, totalRevenue: 0, totalPrice: 0 });
      }
      const current = stats.get(category)!;
      current.productCount += 1;
      current.totalPrice += product.price;
    });

    return Array.from(stats.entries()).map(([category, data]) => ({
      category,
      productCount: data.productCount,
      totalRevenue: data.totalPrice,
      averagePrice: data.totalPrice / data.productCount
    }));
  };

  const getTopSellingProducts = () => {
    return products
      .sort((a, b) => (b.stockQuantity || 0) - (a.stockQuantity || 0))
      .slice(0, 5);
  };

  const getEmployeePerformance = () => {
    return employees.map(emp => ({
      ...emp,
      performance: Math.floor(Math.random() * 40) + 60, // Simulated performance
      salesCount: Math.floor(Math.random() * 50) + 10, // Simulated sales count
      customerRating: Math.floor(Math.random() * 20) + 80 // Simulated rating
    }));
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <CircularProgress size={60} sx={{ color: 'white', mb: 2 }} />
        <Typography variant="h6" sx={{ color: 'white' }}>
          Mağaza verileri yükleniyor...
        </Typography>
      </Box>
    );
  }

  if (!storeData) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Mağaza bulunamadı</Alert>
      </Box>
    );
  }

  const renderOverviewTab = () => {
    // Debug logging
    console.log('StoreDetailPage Debug Info:');
    console.log('storeData:', storeData);
    console.log('employees:', employees);
    console.log('products:', products);
    console.log('weeklySales:', weeklySales);
    console.log('sales:', sales);
    console.log('getTotalRevenue():', getTotalRevenue());
    console.log('getTotalSoldProducts():', getTotalSoldProducts());
    
    // Check if we have data
    const hasData = storeData && employees.length > 0 && products.length > 0;
    const hasWeeklySales = weeklySales.length > 0;
    
    return (
    <Box>
      {/* Test Component */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" color="primary">
          Test Component - Debug Info
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Store ID: {storeId} | Products: {products.length} | Employees: {employees.length} | Weekly Sales: {weeklySales.length}
        </Typography>
        {!hasData && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            Veri yükleniyor veya eksik. Lütfen bekleyin veya sayfayı yenileyin.
          </Alert>
        )}
      </Box>

      {/* Hero Section with Modern Design */}
      <Card sx={{ 
        mb: 4, 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: 4,
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Background Pattern */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          transform: 'translate(100px, -100px)'
        }} />
        
        <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
            <Avatar sx={{ 
              width: 80, 
              height: 80, 
              bgcolor: 'rgba(255,255,255,0.2)',
              border: '3px solid rgba(255,255,255,0.3)',
              backdropFilter: 'blur(10px)'
            }}>
              <StoreIcon sx={{ fontSize: 40 }} />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                {storeData.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <LocationIcon sx={{ fontSize: 20, color: 'rgba(255,255,255,0.9)' }} />
                <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                  {storeData.address}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PhoneIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.8)' }} />
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    {storeData.phone}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmailIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.8)' }} />
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    {storeData.email}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Chip 
              label={storeData.isActive ? '🟢 Aktif' : '🔴 Pasif'} 
              color={storeData.isActive ? 'success' : 'error'}
              sx={{ 
                color: 'white', 
                fontWeight: 700, 
                fontSize: '1rem',
                height: 40,
                px: 2,
                background: storeData.isActive ? 'rgba(76, 175, 80, 0.9)' : 'rgba(244, 67, 54, 0.9)',
                backdropFilter: 'blur(10px)'
              }}
            />
          </Box>

          {/* Enhanced Statistics Cards */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3 }}>
            <Card sx={{ 
              background: 'rgba(255,255,255,0.15)', 
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 3,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                background: 'rgba(255,255,255,0.2)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
              }
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  mb: 2,
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background: 'rgba(76, 175, 80, 0.2)',
                  mx: 'auto'
                }}>
                  <TrendingUpIcon sx={{ fontSize: 32, color: '#4caf50' }} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'white', mb: 1 }}>
                  ₺{getTotalRevenue().toLocaleString('tr-TR')}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>
                  Toplam Gelir
                </Typography>
              </CardContent>
            </Card>
            
            <Card sx={{ 
              background: 'rgba(255,255,255,0.15)', 
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 3,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                background: 'rgba(255,255,255,0.2)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
              }
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  mb: 2,
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background: 'rgba(255, 152, 0, 0.2)',
                  mx: 'auto'
                }}>
                  <ShoppingBagIcon sx={{ fontSize: 32, color: '#ff9800' }} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'white', mb: 1 }}>
                  {getTotalSoldProducts().toLocaleString('tr-TR')}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>
                  Satılan Ürün
                </Typography>
              </CardContent>
            </Card>
            
            <Card sx={{ 
              background: 'rgba(255,255,255,0.15)', 
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 3,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                background: 'rgba(255,255,255,0.2)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
              }
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  mb: 2,
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background: 'rgba(33, 150, 243, 0.2)',
                  mx: 'auto'
                }}>
                  <PeopleIcon sx={{ fontSize: 32, color: '#2196f3' }} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'white', mb: 1 }}>
                  {employees.length}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>
                  Çalışan
                </Typography>
              </CardContent>
            </Card>
            
            <Card sx={{ 
              background: 'rgba(255,255,255,0.15)', 
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 3,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                background: 'rgba(255,255,255,0.2)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
              }
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  mb: 2,
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background: 'rgba(156, 39, 176, 0.2)',
                  mx: 'auto'
                }}>
                  <InventoryIcon sx={{ fontSize: 32, color: '#9c27b0' }} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'white', mb: 1 }}>
                  {products.length}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>
                  Ürün Çeşidi
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </CardContent>
      </Card>

      {/* Performance Analytics Section */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 3, mb: 4 }}>
        {/* Weekly Sales Performance */}
          <Card sx={{ borderRadius: 3, height: '100%' }}>
        <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1976d2' }}>
                  📊 Haftalık Satış Performansı
          </Typography>
                <Chip 
                  label={`${weeklySales.length} Hafta`} 
                  color="primary" 
                  variant="outlined"
                  icon={<TimelineIcon />}
                />
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2 }}>
                {weeklySales.length > 0 ? (
                  weeklySales.map((sale, index) => (
                    <Paper key={sale.id} sx={{ 
                      p: 2, 
                      textAlign: 'center', 
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                      border: '1px solid #dee2e6',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                      }
                    }}>
                      <Typography variant="subtitle2" sx={{ color: '#495057', mb: 1, fontWeight: 600 }}>
                  {index + 1}. Hafta
                </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: '#1976d2', mb: 1 }}>
                  ₺{sale.weeklyRevenue.toLocaleString('tr-TR')}
                </Typography>
                      <Typography variant="body2" sx={{ color: '#6c757d', mb: 2 }}>
                  {sale.soldProducts} ürün satıldı
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={(sale.weeklyRevenue / Math.max(...weeklySales.map(s => s.weeklyRevenue))) * 100}
                        sx={{ 
                          height: 8, 
                          borderRadius: 4,
                          background: '#e9ecef',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 4
                          }
                        }}
                        color={sale.weeklyRevenue > 10000 ? 'success' : sale.weeklyRevenue > 5000 ? 'warning' : 'error'}
                />
              </Paper>
                  ))
                ) : (
                  <Box sx={{ 
                    gridColumn: '1 / -1', 
                    textAlign: 'center', 
                    py: 4,
                    color: '#6c757d'
                  }}>
                    <TimelineIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      Haftalık Satış Verisi Bulunamadı
                    </Typography>
                    <Typography variant="body2">
                      Bu mağaza için henüz haftalık satış verisi bulunmuyor.
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        {/* Quick Stats */}
        <Card sx={{ borderRadius: 3, height: '100%' }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1976d2', mb: 3 }}>
              🚀 Hızlı İstatistikler
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                p: 2,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                border: '1px solid #90caf9'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CategoryIcon sx={{ color: '#1976d2' }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#1976d2' }}>
                    Kategori Sayısı
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#1976d2' }}>
                  {products.length > 0 ? new Set(products.map(p => p.category)).size : 0}
                </Typography>
              </Box>
              
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                p: 2,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
                border: '1px solid #ce93d8'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AttachMoneyIcon sx={{ color: '#9c27b0' }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#9c27b0' }}>
                    Ortalama Fiyat
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#9c27b0' }}>
                  ₺{products.length > 0 ? Math.round(products.reduce((sum, p) => sum + p.price, 0) / products.length).toLocaleString('tr-TR') : '0'}
                </Typography>
              </Box>
              
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                p: 2,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
                border: '1px solid #a5d6a7'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingUpIcon sx={{ color: '#4caf50' }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#9c27b0' }}>
                    Stok Değeri
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#4caf50' }}>
                  ₺{products.length > 0 ? products.reduce((sum, p) => sum + (p.price * p.stockQuantity), 0).toLocaleString('tr-TR') : '0'}
                </Typography>
              </Box>
          </Box>
        </CardContent>
      </Card>
      </Box>
    </Box>
  );
  };

  const renderEmployeesTab = () => (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#1976d2' }}>
          Mağaza Personeli ({employees.length} kişi)
        </Typography>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, 
          gap: 3 
        }}>
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
      </CardContent>
    </Card>
  );

  const renderProductsTab = () => (
    <Box>
      {/* Arama ve Filtreleme */}
      <Card sx={{ mb: 3, borderRadius: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              fullWidth
              placeholder="Ürün ara (isim, kod, kategori)..."
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
            <Button variant="outlined" startIcon={<FilterIcon />}>
              Filtrele
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Ürünler Grid */}
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#1976d2' }}>
            Mağaza Ürünleri ({filteredProducts.length} ürün)
          </Typography>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }, 
            gap: 3 
          }}>
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
                  image={`${window.location.origin}${product.imageUrl}`}
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
        </CardContent>
      </Card>
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Global Navbar */}
      <Navbar 
        storeData={storeData ? {
          id: storeData.id,
          name: storeData.name,
          isActive: storeData.isActive
        } : undefined}
      />

      {/* Store Detail Content */}
      <Box sx={{ p: 3, flex: 1 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

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
        {currentTab === 0 && renderOverviewTab()}
        {currentTab === 1 && renderEmployeesTab()}
        {currentTab === 2 && renderProductsTab()}
      </Box>
      
      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default StoreDetailPage;