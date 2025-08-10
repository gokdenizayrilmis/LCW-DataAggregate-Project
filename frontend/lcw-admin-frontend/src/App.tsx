import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import StoreListPage from './pages/StoreListPage';
import StoreDetailPage from './pages/StoreDetailPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminLoginPage />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/stores" element={<StoreListPage />} />
        <Route path="/store/:storeId" element={<StoreDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;
