
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './routes/PrivateRoute';

import Dashboard from './pages/Dashboard';
import AdminPage from './pages/AdminPage';
import NotAuthorized from './pages/error/NotAuthorized';
import LoginPage from './pages/auth/LoginPage';
import Layout from './components/Layout';
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>

          {/* --------------- VISTAS PUBLICAS -------------- */}

          <Route path="/auth/login" element={<LoginPage />} />

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
