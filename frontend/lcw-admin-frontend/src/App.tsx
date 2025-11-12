import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import StoresPage from './pages/StoresPage';
import StoreManagementPage from './pages/StoreManagementPage';
import ProductsPage from './pages/ProductsPage';
import InventoryPage from './pages/InventoryPage';
import UsersPage from './pages/UsersPage';
import SupportPage from './pages/SupportPage';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<AdminLoginPage />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/stores" element={<StoresPage />} />
          <Route path="/store-management" element={<StoreManagementPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/support" element={<SupportPage />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
