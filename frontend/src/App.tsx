import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar/Navbar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ForgotPassword from './components/Auth/ForgotPassword';
import Profile from './components/Profile/Profile';
import Shop from './components/Shop/Shop';
import Wishlist from './components/Wishlist/Wishlist';
import Home from './components/Home/Home';
import About from './components/About/About';
import Contact from './components/Contact/Contact';
import Services from './pages/Services';
import AdminDashboard from './components/Admin/AdminDashboard';
import ProductManagement from './components/Admin/ProductManagement';
import UserList from './components/Admin/UserList';
import QueryList from './components/Admin/QueryList';
import ProductDetails from './components/Product/ProductDetails';
import RepairEntryForm from './components/Admin/RepairEntryForm';
import RepairDashboard from './components/Admin/RepairDashboard';
import QuotationBillPage from './components/Admin/QuotationBillPage';
import AdminQuotationList from './components/Admin/AdminQuotationList';
import './styles/globals.css';
import { Toaster } from 'react-hot-toast';
import Footer from './components/layout/Footer';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <Toaster position="top-right" />
              <Navbar />
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/services" element={<Services />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* Protected routes */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/wishlist"
                  element={
                    <ProtectedRoute>
                      <Wishlist />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/products"
                  element={
                    <ProtectedRoute>
                      <ProductManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute>
                      <UserList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/queries"
                  element={
                    <ProtectedRoute>
                      <QueryList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/repairs/new"
                  element={
                    <ProtectedRoute>
                      <RepairEntryForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/repairs/edit/:id"
                  element={
                    <ProtectedRoute>
                      <RepairEntryForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/repairs"
                  element={
                    <ProtectedRoute>
                      <RepairDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/quotation/new"
                  element={
                    <ProtectedRoute>
                      <QuotationBillPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/quotation"
                  element={
                    <ProtectedRoute>
                      <AdminQuotationList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/quotation/edit/:id"
                  element={
                    <ProtectedRoute>
                      <QuotationBillPage />
                    </ProtectedRoute>
                  }
                />

                <Route path="/product/:id" element={<ProductDetails />} />

                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <Footer />
            </div>
          </Router>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
