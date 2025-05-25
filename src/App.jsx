
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './routes/PrivateRoute';

import Dashboard from './pages/Dashboard';
import AdminPage from './pages/AdminPage';
import NotAuthorized from './pages/error/NotAuthorized';
import LoginPage from './pages/auth/LoginPage';
import Layout from './components/Layout';
import CatalogPage from './pages/CatalogPage';
import ProductTableAdmin from './pages/admin/ProductTableAdmin';
import EditorialPage from './pages/admin/EditorialPage';
import { ROUTES } from './constants/routes';
import AuthorPage from './pages/admin/AuthorPage';
import CategoryPage from './pages/admin/CategoryPage';
import StockMovementPage from './pages/admin/StockMovementPage';
import CashierPage from './pages/admin/CashierPage';
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>

          {/* --------------- VISTAS PUBLICAS -------------- */}

          <Route path="/auth/login" element={<LoginPage />} />

          <Route path="/" element={<Layout><CatalogPage /></Layout>} />

          {/* ---------------------------------------------- */}

          {/* 
          
            Para crear accesos a rutas por rol,
            añaden esto: allowedPermissions={['GET_PERSONS']}
            Cambian GET_PERSONS por un nombre de permiso.
            En el backend en el modulo de roles, en enums estan los permisos
          
          */}


          <Route
            path="/dashboard"
            element={
              <PrivateRoute allowedRoles={['ADMINISTRADOR', 'DOCENTE', 'ESTUDIANTE', 'APODERADO']}>
                <Layout>
                  <Dashboard />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute allowedRoles={['ADMINISTRADOR']}>
                <AdminPage />
              </PrivateRoute>
            }
          />

          <Route
            path={ROUTES.ADMIN_PRODUCTS}
            element={
              <PrivateRoute allowedRoles={['ADMINISTRADOR']}>
                <Layout>
                  <ProductTableAdmin />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path={ROUTES.ADMIN_EDITORIALS}
            element={
              <PrivateRoute allowedRoles={['ADMINISTRADOR']}>
                <Layout>
                  <EditorialPage />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path={ROUTES.ADMIN_AUTHORS}
            element={
              <PrivateRoute allowedRoles={['ADMINISTRADOR']}>
                <Layout>
                  <AuthorPage />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path={ROUTES.ADMIN_CATEGORIES}
            element={
              <PrivateRoute allowedRoles={['ADMINISTRADOR']}>
                <Layout>
                  <CategoryPage />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path={ROUTES.ADMIN_STOCK_MOVEMENT}
            element={
              <PrivateRoute allowedRoles={['ADMINISTRADOR']}>
                <Layout>
                  <StockMovementPage />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path={ROUTES.ADMIN_SALES}
            element={
              <PrivateRoute allowedRoles={['ADMINISTRADOR']}>
                <Layout>
                  <CashierPage />
                </Layout>
              </PrivateRoute>
            }
          />


          <Route path="/not-authorized" element={<NotAuthorized />} />


          <Route
            path="*"
            element={
              <PrivateRoute allowedRoles={['ADMINISTRADOR', 'DOCENTE', 'ESTUDIANTE', 'APODERADO']}>
                <Layout>
                  <Dashboard />
                </Layout>
              </PrivateRoute>
            }
          />


        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
