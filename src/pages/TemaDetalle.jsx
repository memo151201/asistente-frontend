// src/pages/TemaDetalle.jsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Pages.css';

const API_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api` 
  : 'http://localhost:8080/api';

const TemaDetalle = () => {
  const { temaId } = useParams();
  const navigate = useNavigate();
  const [tema, setTema] = useState(null);
  const [subtemas, setSubtemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTemaDetalle();
  }, [temaId]);

  const fetchTemaDetalle = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      // Obtener tema
      const temaResponse = await axios.get(`${API_URL}/temas/${temaId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTema(temaResponse.data);

      // Obtener subtemas del tema
      const subtemasResponse = await axios.get(`${API_URL}/subtemas/tema/${temaId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Ordenar subtemas por orden
      const subtemasOrdenados = subtemasResponse.data.sort((a, b) => a.orden - b.orden);
      setSubtemas(subtemasOrdenados);

      setLoading(false);
    } catch (err) {
      console.error('Error al cargar el tema:', err);
      setError('Error al cargar la información');
      setLoading(false);
    }
  };



const handleEstudiar = (subtemaId) => {
  navigate(`/estudiar/${subtemaId}`);
};

  const handleVolver = () => {
    if (tema && tema.materia) {
      navigate(`/materias/${tema.materia.id}`);
    } else {
      navigate('/dashboard');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando tema...</p>
      </div>
    );
  }

  if (error || !tema) {
    return (
      <div className="error-container">
        <p>⚠️ {error || 'No se pudo cargar el tema'}</p>
        <button onClick={() => navigate('/dashboard')} className="btn-primary">
          ← Volver al Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="tema-detalle-container">
      {/* Header */}
      <div className="tema-header">
        <button onClick={handleVolver} className="btn-back">
          ← Volver
        </button>
        
        <div className="tema-info">
          <h1>{tema.nombre}</h1>
          {tema.materia && (
            <p className="tema-materia">
              📚 {tema.materia.nombre}
            </p>
          )}
          <p className="tema-descripcion">{tema.descripcion}</p>
        </div>
      </div>

      {/* Subtemas Grid */}
      <div className="subtemas-section">
        <h2>📝 Subtemas</h2>
        
        {subtemas.length === 0 ? (
          <div className="empty-state">
            <p>😔 No hay subtemas disponibles para este tema</p>
          </div>
        ) : (
          <div className="subtemas-grid">
            {subtemas.map((subtema) => (
              <div key={subtema.id} className="subtema-card">
                <div className="subtema-badge">{subtema.orden}</div>
                
                <h3>{subtema.nombre}</h3>
                <p className="subtema-descripcion">{subtema.descripcion}</p>
                
                {subtema.contenido && (
                  <div className="subtema-contenido">
                    <p>{subtema.contenido.substring(0, 150)}...</p>
                  </div>
                )}
                
                      <button 
                        onClick={() => handleEstudiar(subtema.id)}
                        className="btn-cuestionario"
                      >
                    Ver Contenido
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TemaDetalle;