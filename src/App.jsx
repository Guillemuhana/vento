import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import { useAuthStore } from './store/useAuthStore'
import ProtectedRoute from './components/layout/ProtectedRoute'
import BottomNav from './components/layout/BottomNav'

import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

import Home from './pages/customer/Home'
import StoreDetail from './pages/customer/StoreDetail'
import Cart from './pages/customer/Cart'
import Checkout from './pages/customer/Checkout'
import OrderTracking from './pages/customer/OrderTracking'
import OrderHistory from './pages/customer/OrderHistory'
import Account from './pages/customer/Account'
import EditProfile from './pages/customer/EditProfile'
import Offers from './pages/customer/Offers'
import Favorites from './pages/customer/Favorites'
import Search from './pages/customer/Search'
import CategoryStores from './pages/customer/CategoryStores'

import StoreDashboard from './pages/store-owner/Dashboard'
import StoreProducts from './pages/store-owner/Products'
import StoreProductForm from './pages/store-owner/ProductForm'
import StoreOrders from './pages/store-owner/Orders'
import StoreSettings from './pages/store-owner/StoreSettings'

import CourierAvailable from './pages/courier/AvailableOrders'
import CourierActiveDelivery from './pages/courier/ActiveDelivery'
import CourierEarnings from './pages/courier/Earnings'

import AdminDashboard from './pages/admin/Dashboard'
import AdminStores from './pages/admin/Stores'
import AdminUsers from './pages/admin/Users'

function CustomerLayout({ children }) {
  return (
    <>
      {children}
      <BottomNav />
    </>
  )
}

export default function App() {
  const init = useAuthStore((s) => s.init)
  const profile = useAuthStore((s) => s.profile)

  useEffect(() => {
    init()
  }, [init])

  return (
    <>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />

        {/* Redirige a cada usuario a su "home" según el rol */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              {profile?.role === 'comercio' ? (
                <Navigate to="/comercio" replace />
              ) : profile?.role === 'repartidor' ? (
                <Navigate to="/repartidor" replace />
              ) : profile?.role === 'admin' ? (
                <Navigate to="/admin" replace />
              ) : (
                <CustomerLayout>
                  <Home />
                </CustomerLayout>
              )}
            </ProtectedRoute>
          }
        />

        {/* Cliente */}
        <Route
          path="/comercio/:id"
          element={
            <ProtectedRoute roles={['cliente']}>
              <StoreDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/carrito"
          element={
            <ProtectedRoute roles={['cliente']}>
              <CustomerLayout>
                <Cart />
              </CustomerLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute roles={['cliente']}>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pedido/:id"
          element={
            <ProtectedRoute>
              <OrderTracking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pedidos"
          element={
            <ProtectedRoute roles={['cliente']}>
              <CustomerLayout>
                <OrderHistory />
              </CustomerLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/ofertas"
          element={
            <ProtectedRoute roles={['cliente']}>
              <CustomerLayout>
                <Offers />
              </CustomerLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/favoritos"
          element={
            <ProtectedRoute roles={['cliente']}>
              <CustomerLayout>
                <Favorites />
              </CustomerLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/categoria/:slug"
          element={
            <ProtectedRoute roles={['cliente']}>
              <CustomerLayout>
                <CategoryStores />
              </CustomerLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/buscar"
          element={
            <ProtectedRoute roles={['cliente']}>
              <Search />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cuenta"
          element={
            <ProtectedRoute>
              <CustomerLayout>
                <Account />
              </CustomerLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/cuenta/perfil"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />
        <Route path="/perfil" element={<Navigate to="/cuenta" replace />} />

        {/* Comercio */}
        <Route
          path="/comercio"
          element={
            <ProtectedRoute roles={['comercio']}>
              <StoreDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/comercio/productos"
          element={
            <ProtectedRoute roles={['comercio']}>
              <StoreProducts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/comercio/productos/nuevo"
          element={
            <ProtectedRoute roles={['comercio']}>
              <StoreProductForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/comercio/pedidos"
          element={
            <ProtectedRoute roles={['comercio']}>
              <StoreOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/comercio/ajustes"
          element={
            <ProtectedRoute roles={['comercio']}>
              <StoreSettings />
            </ProtectedRoute>
          }
        />

        {/* Repartidor */}
        <Route
          path="/repartidor"
          element={
            <ProtectedRoute roles={['repartidor']}>
              <CourierAvailable />
            </ProtectedRoute>
          }
        />
        <Route
          path="/repartidor/entrega/:id"
          element={
            <ProtectedRoute roles={['repartidor']}>
              <CourierActiveDelivery />
            </ProtectedRoute>
          }
        />
        <Route
          path="/repartidor/ganancias"
          element={
            <ProtectedRoute roles={['repartidor']}>
              <CourierEarnings />
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/comercios"
          element={
            <ProtectedRoute roles={['admin']}>
              <AdminStores />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/usuarios"
          element={
            <ProtectedRoute roles={['admin']}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
