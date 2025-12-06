// src/pages/Dashboard.jsx

import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/apiService';
import './Pages.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ✅ REDIRIGIR ADMIN AL PANEL DE ADMINISTRACIÓN
  if (user?.rol === 'ADMINISTRADOR') {
    return <Navigate to="/admin" replace />;
  }

  useEffect(() => {
    loadMaterias();
  }, []);

  const loadMaterias = async () => {
    try {
      const response = await apiService.getMaterias();
      setMaterias(response.data);
    } catch (err) {
      setError('Error al cargar las materias');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando materias...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Bienvenido, {user?.nombre}! 👋</h1>
        <p>Selecciona una materia para comenzar a aprender</p>
      </div>

      {error && <div className="error-box">{error}</div>}

      <div className="materias-grid">
        {materias.map((materia) => (
          <div key={materia.id} className="materia-card">
            <div className="materia-header">
              <h3>{materia.nombre}</h3>
              <span className={`nivel-badge nivel-${materia.nivelDificultad.toLowerCase()}`}>
                {materia.nivelDificultad}
              </span>
            </div>

            <p className="materia-description">{materia.descripcion}</p>

            <div className="materia-info">
              <span className="materia-codigo">📚 {materia.codigo}</span>
            </div>

            <Link 
              to={`/materias/${materia.id}`} 
              className="btn-materia"
            >
              Ver Temas →
            </Link>
          </div>
        ))}
      </div>

      {materias.length === 0 && !loading && (
        <div className="empty-state">
          <p>No hay materias disponibles en este momento</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;