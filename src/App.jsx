// src/App.jsx

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import MateriaDetalle from './pages/MateriaDetalle';
import TemaDetalle from './pages/TemaDetalle';
import EstudiarSubtema from './pages/EstudiarSubtema';
import Cuestionario from './pages/Cuestionario';
import CuestionarioIA from './pages/CuestionarioIA';

// ADMIN
import PerfilAdmin from './pages/admin/PerfilAdmin';
import AdminDashboard from './pages/admin/AdminDashboard';
import GestionJerarquica from './pages/admin/GestionJerarquica';
import GestionPreguntas from './pages/admin/GestionPreguntas';
import GestionContenidos from './pages/admin/GestionContenidos';
import GestionEjercicios from './pages/admin/GestionEjercicios';
import GestionUsuarios from './pages/admin/GestionUsuarios';
import './App.css';

// Componente para rutas protegidas
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};


const PublicRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return children;
  }

  // Si está autenticado, redirigir según rol
  if (user?.rol === 'ADMINISTRADOR') {
    return <Navigate to="/admin" />;
  }
  
  return <Navigate to="/dashboard" />;
};

// Componente para rutas de ADMIN
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.rol !== 'ADMINISTRADOR') {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

function AppContent() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<Home />} />
            
            {/* Rutas de autenticación */}
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            <Route 
              path="/register" 
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              } 
            />

            {/* ============================================ */}
            {/* RUTAS PROTEGIDAS - USUARIOS NORMALES */}
            {/* ============================================ */}
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />

            {/* Ruta para ver los temas de una materia */}
            <Route 
              path="/materias/:materiaId" 
              element={
                <PrivateRoute>
                  <MateriaDetalle />
                </PrivateRoute>
              } 
            />

            {/* Ruta para ver los subtemas de un tema */}
            <Route 
              path="/temas/:temaId" 
              element={
                <PrivateRoute>
                  <TemaDetalle />
                </PrivateRoute>
              } 
            />

            {/* Ruta para estudiar un subtema */}
            <Route 
              path="/estudiar/:subtemaId" 
              element={
                <PrivateRoute>
                  <EstudiarSubtema />
                </PrivateRoute>
              } 
            />

            {/* Ruta para el cuestionario normal */}
            <Route 
              path="/cuestionario/:subtemaId" 
              element={
                <PrivateRoute>
                  <Cuestionario />
                </PrivateRoute>
              } 
            />

            {/* Ruta para cuestionario con IA */}
            <Route 
              path="/cuestionario-ia/:subtemaId" 
              element={
                <PrivateRoute>
                  <CuestionarioIA />
                </PrivateRoute>
              } 
            />

            {/* ============================================ */}
            {/* RUTAS DE ADMINISTRADOR */}
            {/* ============================================ */}
            <Route 
              path="/admin" 
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } 
            />
            
            {/* ✅ PERFIL DE ADMINISTRADOR */}
            <Route 
              path="/admin/perfil" 
              element={
                <AdminRoute>
                  <PerfilAdmin />
                </AdminRoute>
              } 
            />
            
            {/* GESTIÓN JERÁRQUICA */}
            <Route 
              path="/admin/jerarquia" 
              element={
                <AdminRoute>
                  <GestionJerarquica />
                </AdminRoute>
              } 
            />
            
            {/* GESTIÓN DE CONTENIDOS */}
            <Route 
              path="/admin/contenidos" 
              element={
                <AdminRoute>
                  <GestionContenidos />
                </AdminRoute>
              } 
            />
            
            {/* GESTIÓN DE EJERCICIOS */}
            <Route 
              path="/admin/ejercicios" 
              element={
                <AdminRoute>
                  <GestionEjercicios />
                </AdminRoute>
              } 
            />
            
            {/* GESTIÓN DE PREGUNTAS */}
            <Route 
              path="/admin/preguntas" 
              element={
                <AdminRoute>
                  <GestionPreguntas />
                </AdminRoute>
              } 
            />
            
            {/* GESTIÓN DE USUARIOS */}
            <Route 
              path="/admin/usuarios" 
              element={
                <AdminRoute>
                  <GestionUsuarios />
                </AdminRoute>
              } 
            />

            {/* Redirigir rutas no encontradas */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;