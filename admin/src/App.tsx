import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import PromotionsList from './pages/promotions/PromotionsList';
import StoresList from './pages/stores/StoresList';
import ProductsList from './pages/products/ProductsList';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/promotions" element={<PromotionsList />} />
        <Route path="/stores" element={<StoresList />} />
        <Route path="/products" element={<ProductsList />} />
      </Routes>
    </Layout>
  );
}
