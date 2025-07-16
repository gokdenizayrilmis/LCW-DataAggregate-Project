import React from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Divider,
  Card,
  CardContent,
  IconButton,
  Chip,
  LinearProgress
} from '@mui/material';
import {
  Store,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Undo,
  Inventory,
  People,
  AttachMoney,
  MoreVert
} from '@mui/icons-material';

const DashboardPage: React.FC = () => {
  const stats = [
    {
      title: 'Toplam Mağaza',
      value: '12',
      change: '+2',
      changeType: 'positive',
      icon: <Store sx={{ fontSize: 40, color: '#2196f3' }} />,
      color: 'linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)',
      progress: 75
    },
    {
      title: 'Toplam Satış',
      value: '₺45,230',
      change: '+12.5%',
      changeType: 'positive',
      icon: <ShoppingCart sx={{ fontSize: 40, color: '#4caf50' }} />,
      color: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
      progress: 85
    },
    {
      title: 'Toplam İade',
      value: '18',
      change: '-5.2%',
      changeType: 'negative',
      icon: <Undo sx={{ fontSize: 40, color: '#ff9800' }} />,
      color: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
      progress: 25
    },
    {
      title: 'Toplam Stok',
      value: '1,250',
      change: '+8.1%',
      changeType: 'positive',
      icon: <Inventory sx={{ fontSize: 40, color: '#9c27b0' }} />,
      color: 'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)',
      progress: 60
    }
  ];

  const recentActivities = [
    { id: 1, action: 'Yeni mağaza eklendi', store: 'LCW Kadıköy', time: '2 saat önce', type: 'success' },
    { id: 2, action: 'Satış gerçekleşti', store: 'LCW Beşiktaş', time: '4 saat önce', type: 'info' },
    { id: 3, action: 'İade işlemi', store: 'LCW Şişli', time: '6 saat önce', type: 'warning' },
    { id: 4, action: 'Stok güncellendi', store: 'LCW Bakırköy', time: '8 saat önce', type: 'success' },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 800, color: '#1976d2', mb: 1 }}>
          Hoş Geldiniz! 👋
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          LCW Yönetim Sistemi Dashboard
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
        gap: 3,
        mb: 4
      }}>
        {stats.map((stat, index) => (
          <Card key={index} sx={{ 
            height: '100%',
            background: stat.color,
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease'
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                {stat.icon}
                <IconButton size="small" sx={{ color: 'white' }}>
                  <MoreVert />
                </IconButton>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                {stat.value}
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
                {stat.title}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {stat.changeType === 'positive' ? (
                  <TrendingUp sx={{ fontSize: 16 }} />
                ) : (
                  <TrendingDown sx={{ fontSize: 16 }} />
                )}
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  {stat.change}
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={stat.progress} 
                sx={{ 
                  mt: 2, 
                  height: 4, 
                  borderRadius: 2,
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: 'white'
                  }
                }} 
              />
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Charts and Activities Section */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
        gap: 3
      }}>
        {/* Chart Placeholder */}
        <Card sx={{ height: 400, p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Satış Grafiği
            </Typography>
            <Chip label="Son 30 gün" color="primary" size="small" />
          </Box>
          <Box sx={{ 
            height: 300, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e3f2fd 100%)',
            borderRadius: 2,
            border: '2px dashed #e0e0e0'
          }}>
            <Box sx={{ textAlign: 'center' }}>
              <AttachMoney sx={{ fontSize: 60, color: '#2196f3', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                Grafikler yakında eklenecek
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Satış verilerinizi görselleştirin
              </Typography>
            </Box>
          </Box>
        </Card>

        {/* Recent Activities */}
        <Card sx={{ height: 400, p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Son Aktiviteler
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {recentActivities.map((activity) => (
              <Box key={activity.id} sx={{ 
                p: 2, 
                borderRadius: 2, 
                backgroundColor: '#f8fafc',
                border: '1px solid #e0e0e0'
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {activity.action}
                  </Typography>
                  <Chip 
                    label={activity.type} 
                    size="small" 
                    color={activity.type === 'success' ? 'success' : activity.type === 'warning' ? 'warning' : 'info'}
                  />
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {activity.store}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  {activity.time}
                </Typography>
              </Box>
            ))}
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default DashboardPage; 