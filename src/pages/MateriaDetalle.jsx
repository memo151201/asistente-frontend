// src/pages/MateriaDetalle.jsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Pages.css';

const API_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api` 
  : 'http://localhost:8080/api';

const MateriaDetalle = () => {
  const { materiaId } = useParams();
  const navigate = useNavigate();
  const [materia, setMateria] = useState(null);
  const [temas, setTemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMateriaDetalle();
  }, [materiaId]);

  const fetchMateriaDetalle = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      // Obtener materia
      const materiaResponse = await axios.get(`${API_URL}/materias/${materiaId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMateria(materiaResponse.data);

      // Obtener temas de la materia
      const temasResponse = await axios.get(`${API_URL}/temas/materia/${materiaId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Ordenar temas por orden
      const temasOrdenados = temasResponse.data.sort((a, b) => a.orden - b.orden);
      setTemas(temasOrdenados);

      setLoading(false);
    } catch (err) {
      console.error('Error al cargar la materia:', err);
      setError('Error al cargar la información');
      setLoading(false);
    }
  };

  const handleVerSubtemas = (temaId) => {
    navigate(`/temas/${temaId}`);
  };

  const getDificultadColor = (nivel) => {
    const colores = {
      BASICO: '#4CAF50',
      INTERMEDIO: '#FF9800',
      AVANZADO: '#F44336'
    };
    return colores[nivel] || '#757575';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando materia...</p>
      </div>
    );
  }

  if (error || !materia) {
    return (
      <div className="error-container">
        <p>⚠️ {error || 'No se pudo cargar la materia'}</p>
        <button onClick={() => navigate('/dashboard')} className="btn-primary">
          ← Volver al Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="materia-detalle-container">
      {/* Header */}
      <div className="materia-header">
        <button onClick={() => navigate('/dashboard')} className="btn-back">
          ← Volver
        </button>
        
        <div className="materia-info">
          <h1>{materia.nombre}</h1>
          <div className="materia-meta">
            <span 
              className="badge-nivel"
              style={{ backgroundColor: getDificultadColor(materia.nivelDificultad) }}
            >
              {materia.nivelDificultad}
            </span>
            <span className="materia-codigo">📚 {materia.codigo}</span>
          </div>
          <p className="materia-descripcion">{materia.descripcion}</p>
        </div>
      </div>

      {/* Lista de Temas */}
      <div className="temas-section">
        <h2>📖 Temas del Curso</h2>
        
        {temas.length === 0 ? (
          <div className="empty-state">
            <p>😔 No hay temas disponibles para esta materia</p>
          </div>
        ) : (
          <div className="temas-list">
            {temas.map((tema) => (
              <div key={tema.id} className="tema-card">
                <div className="tema-header">
                  <div className="tema-numero">{tema.orden}</div>
                  <div className="tema-info">
                    <h3>{tema.nombre}</h3>
                    <p>{tema.descripcion}</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleVerSubtemas(tema.id)}
                  className="btn-subtemas"
                >
                  Ver Subtemas →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MateriaDetalle;