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
import AdminDashboard from './pages/admin/AdminDashboard';
import GestionMaterias from './pages/admin/GestionMaterias';
import GestionTemas from './pages/admin/GestionTemas';
import GestionSubtemas from './pages/admin/GestionSubtemas';
import GestionPreguntas from './pages/admin/GestionPreguntas';

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

// Componente para rutas públicas (solo si NO está autenticado)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
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

            {/* Rutas protegidas */}
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

            {/* Ruta para estudiar un subtema (CON IA) */}
            <Route 
              path="/estudiar/:subtemaId" 
              element={
                <PrivateRoute>
                  <EstudiarSubtema />
                </PrivateRoute>
              } 
            />

            {/* Ruta para el cuestionario normal de un subtema */}
            <Route 
              path="/cuestionario/:subtemaId" 
              element={
                <PrivateRoute>
                  <Cuestionario />
                </PrivateRoute>
              } 
            />

            {/* Ruta para cuestionario generado con IA */}
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
            <Route 
              path="/admin/materias" 
              element={
                <AdminRoute>
                  <GestionMaterias />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/temas" 
              element={
                <AdminRoute>
                  <GestionTemas />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/subtemas" 
              element={
                <AdminRoute>
                  <GestionSubtemas />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/preguntas" 
              element={
                <AdminRoute>
                  <GestionPreguntas />
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