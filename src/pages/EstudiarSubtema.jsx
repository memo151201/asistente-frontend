// src/pages/EstudiarSubtema.jsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Pages.css';

const API_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api` 
  : 'http://localhost:8080/api';

const EstudiarSubtema = () => {
  const { subtemaId } = useParams();
  const navigate = useNavigate();

  // Estados
  const [subtema, setSubtema] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para IA
  const [explicacionIA, setExplicacionIA] = useState('');
  const [ejemplosIA, setEjemplosIA] = useState('');
  const [loadingExplicacion, setLoadingExplicacion] = useState(false);
  const [loadingEjemplos, setLoadingEjemplos] = useState(false);

  useEffect(() => {
    fetchSubtema();
  }, [subtemaId]);

  const fetchSubtema = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const response = await axios.get(`${API_URL}/subtemas/${subtemaId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSubtema(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error al cargar subtema:', err);
      setError('Error al cargar el contenido');
      setLoading(false);
    }
  };

  const handleExplicarConIA = async () => {
    try {
      setLoadingExplicacion(true);
      const token = localStorage.getItem('token');

      console.log('🤖 Solicitando explicación a la IA...');

      const response = await axios.post(
        `${API_URL}/ia/explicar/${subtemaId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` }}
      );

      setExplicacionIA(response.data.explicacion);
      console.log('✅ Explicación recibida');
      setLoadingExplicacion(false);
    } catch (err) {
      console.error('Error al obtener explicación:', err);
      alert('Error al generar explicación. Intenta de nuevo.');
      setLoadingExplicacion(false);
    }
  };

  const handleGenerarEjemplos = async () => {
    try {
      setLoadingEjemplos(true);
      const token = localStorage.getItem('token');

      console.log('🤖 Solicitando ejemplos a la IA...');

      const response = await axios.post(
        `${API_URL}/ia/ejemplos/${subtemaId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` }}
      );

      setEjemplosIA(response.data.ejemplos);
      console.log('✅ Ejemplos recibidos');
      setLoadingEjemplos(false);
    } catch (err) {
      console.error('Error al obtener ejemplos:', err);
      alert('Error al generar ejemplos. Intenta de nuevo.');
      setLoadingEjemplos(false);
    }
  };

  const handleCuestionarioIA = () => {
    navigate(`/cuestionario-ia/${subtemaId}`);
  };

  const handleCuestionarioNormal = () => {
    navigate(`/cuestionario/${subtemaId}`);
  };

  const handleVolver = () => {
    if (subtema && subtema.tema) {
      navigate(`/temas/${subtema.tema.id}`);
    } else {
      navigate('/dashboard');
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando contenido...</p>
      </div>
    );
  }

  // Error
  if (error || !subtema) {
    return (
      <div className="error-container">
        <p>⚠️ {error || 'No se pudo cargar el contenido'}</p>
        <button onClick={handleVolver} className="btn-primary">
          ← Volver
        </button>
      </div>
    );
  }

  return (
    <div className="estudiar-container">
      {/* Header */}
      <div className="estudiar-header">
        <button onClick={handleVolver} className="btn-back">
          ← Volver
        </button>
        <div className="estudiar-info">
          <h1>📚 {subtema.nombre}</h1>
          {subtema.tema && (
            <p className="estudiar-tema">Tema: {subtema.tema.nombre}</p>
          )}
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="estudiar-content">
        
        {/* Contenido Original de la BD */}
        <div className="contenido-card">
          <h2>📖 Contenido del Tema</h2>
          <div className="contenido-texto">
            <p>{subtema.descripcion}</p>
            {subtema.contenido && (
              <div className="contenido-detalle">
                <p>{subtema.contenido}</p>
              </div>
            )}
          </div>
        </div>

        {/* Botón Explicar con IA */}
        <div className="ia-actions">
          <button 
            onClick={handleExplicarConIA}
            className="btn-ia explicar"
            disabled={loadingExplicacion}
          >
            {loadingExplicacion ? (
              <>⏳ Generando explicación...</>
            ) : (
              <>🤖 Explicar con IA</>
            )}
          </button>

          <button 
            onClick={handleGenerarEjemplos}
            className="btn-ia ejemplos"
            disabled={loadingEjemplos}
          >
            {loadingEjemplos ? (
              <>⏳ Generando ejemplos...</>
            ) : (
              <>💡 Ver Ejemplos con IA</>
            )}
          </button>
        </div>

        {/* Explicación IA */}
        {explicacionIA && (
          <div className="ia-resultado explicacion">
            <h3>🤖 Explicación Detallada con IA</h3>
            <div className="ia-texto">
              <p style={{ whiteSpace: 'pre-line' }}>{explicacionIA}</p>
            </div>
          </div>
        )}

        {/* Ejemplos IA */}
        {ejemplosIA && (
          <div className="ia-resultado ejemplos">
            <h3>💡 Ejemplos Generados con IA</h3>
            <div className="ia-texto codigo">
              <pre>{ejemplosIA}</pre>
            </div>
          </div>
        )}

        {/* Botones de Cuestionario */}
        <div className="cuestionario-actions">
          <h2>🎯 Ahora Practica lo Aprendido</h2>
          
          <div className="botones-cuestionario">
            <div className="opcion-cuestionario">
              <h3>🤖 Cuestionario con IA</h3>
              <p>Preguntas generadas dinámicamente por inteligencia artificial</p>
              <button 
                onClick={handleCuestionarioIA}
                className="btn-cuestionario ia-btn"
              >
                Generar Cuestionario con IA ✨
              </button>
            </div>

            <div className="opcion-cuestionario">
              <h3>📝 Cuestionario Normal</h3>
              <p>Preguntas predefinidas de la base de datos</p>
              <button 
                onClick={handleCuestionarioNormal}
                className="btn-cuestionario normal-btn"
              >
                Empezar Cuestionario Normal
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EstudiarSubtema;