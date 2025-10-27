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

            {/* NUEVA: Ruta para estudiar un subtema (CON IA) */}
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

            {/* NUEVA: Ruta para cuestionario generado con IA */}
            <Route 
              path="/cuestionario-ia/:subtemaId" 
              element={
                <PrivateRoute>
                  <CuestionarioIA />
                </PrivateRoute>
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