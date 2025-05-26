
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './routes/PrivateRoute';

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
import DashboardPage from './pages/admin/DashboardPage';
import RolesPage from './pages/admin/RolesPage';
import UserPage from './pages/admin/UserPage';
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
            path={ROUTES.DASHBOARD}
            element={
              <PrivateRoute allowedPermissions={['REPORTS_VIEW']}>
                <Layout>
                  <DashboardPage />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path={ROUTES.ADMIN_PRODUCTS}
            element={
              <PrivateRoute allowedPermissions={['GET_PRODUCTS']}>
                <Layout>
                  <ProductTableAdmin />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path={ROUTES.ADMIN_EDITORIALS}
            element={
              <PrivateRoute allowedPermissions={['GET_EDITORIALS']}>
                <Layout>
                  <EditorialPage />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path={ROUTES.ADMIN_AUTHORS}
            element={
              <PrivateRoute allowedPermissions={['GET_AUTHORS']}>
                <Layout>
                  <AuthorPage />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path={ROUTES.ADMIN_CATEGORIES}
            element={
              <PrivateRoute allowedPermissions={['GET_CATEGORIES']}>
                <Layout>
                  <CategoryPage />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path={ROUTES.ADMIN_STOCK_MOVEMENT}
            element={
              <PrivateRoute allowedPermissions={['GET_STOCK_MOVEMENTS']}>
                <Layout>
                  <StockMovementPage />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path={ROUTES.ADMIN_SALES}
            element={
              <PrivateRoute allowedPermissions={['GET_SALES']}>
                <Layout>
                  <CashierPage />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path={ROUTES.ADMIN_ROLES}
            element={
              <PrivateRoute allowedPermissions={['GET_ROLES']}>
                <Layout>
                  <RolesPage />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path={ROUTES.ADMIN_USERS}
            element={
              <PrivateRoute allowedPermissions={['GET_PERSONS']}>
                <Layout>
                  <UserPage />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route path="/not-authorized" element={<NotAuthorized />} />


          <Route
            path="*"
            element={
              <PrivateRoute allowedPermissions={['REPORTS_VIEW']}>
                <Layout>
                  <DashboardPage />
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
