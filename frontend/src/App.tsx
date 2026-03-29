import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Register from './pages/Register'
import MyProducts from './pages/MyProducts'
import PagoExitoso from './pages/PagoExitoso'
import PagoPendiente from './pages/PagoPendiente'
import Dashboard from './pages/admin/Dashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminOrders from './pages/admin/AdminOrders'
import AdminCoupons from './pages/admin/AdminCoupons'
import { useAuthStore } from './store/authStore'

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuthStore()
  if (!isAuthenticated || user?.role !== 'admin') return <Navigate to="/" />
  return <>{children}</>
}

function App() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar />
      <main className="flex justify-center">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Products />} />
          <Route path="/productos/:id" element={<ProductDetail />} />
          <Route path="/carrito" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/mis-productos" element={<MyProducts />} />
          <Route path="/pago-exitoso" element={<PagoExitoso />} />
          <Route path="/pago-pendiente" element={<PagoPendiente />} />
          <Route path="/admin" element={<AdminRoute><Dashboard /></AdminRoute>} />
          <Route path="/admin/productos" element={<AdminRoute><AdminProducts /></AdminRoute>} />
          <Route path="/admin/ordenes" element={<AdminRoute><AdminOrders /></AdminRoute>} />
          <Route path="/admin/cupones" element={<AdminRoute><AdminCoupons /></AdminRoute>} />
        </Routes>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}

export default App