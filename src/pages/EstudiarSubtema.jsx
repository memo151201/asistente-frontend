// src/pages/EstudiarSubtema.jsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';
import './Pages.css';

const EstudiarSubtema = () => {
  const { subtemaId } = useParams();
  const navigate = useNavigate();

  // Estados
  const [subtema, setSubtema] = useState(null);
  const [contenidos, setContenidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSubtemaYContenidos();
  }, [subtemaId]);

  const fetchSubtemaYContenidos = async () => {
    try {
      setLoading(true);

      // Obtener subtema
      const subtemaResponse = await apiService.getSubtemas();
      const subtemaEncontrado = subtemaResponse.data.find(s => s.id === parseInt(subtemaId));
      setSubtema(subtemaEncontrado);

      // Obtener contenidos del subtema
      const contenidosResponse = await apiService.getContenidosBySubtema(subtemaId);
      setContenidos(contenidosResponse.data);

      setLoading(false);
    } catch (err) {
      console.error('Error al cargar subtema:', err);
      setError('Error al cargar el contenido');
      setLoading(false);
    }
  };

  const handleCuestionarioNormal = () => {
    navigate(`/cuestionario/${subtemaId}`);
  };

  const handleCuestionarioIA = () => {
    if (contenidos.length === 0) {
      alert('No hay contenidos disponibles. El administrador debe agregar contenidos primero.');
      return;
    }
    navigate(`/cuestionario-ia/${subtemaId}`);
  };

  const handleVolver = () => {
    if (subtema && subtema.tema) {
      navigate(`/temas/${subtema.tema.id}`);
    } else {
      navigate('/dashboard');
    }
  };

  const handleGenerarYResolver = async () => {
  if (contenidos.length === 0) {
    alert('No hay contenidos disponibles para generar preguntas.');
    return;
  }

  if (!window.confirm('¿Generar 5 preguntas con IA basadas en este contenido? Esto puede tardar ~10 segundos.')) {
    return;
  }

  try {
    setLoading(true);
    
    console.log('🤖 Generando preguntas con IA para subtema:', subtemaId);
    
    // Llamar al endpoint que genera y guarda las preguntas
    const response = await apiService.generarPreguntasIA(subtemaId);
    
    console.log('✅ Preguntas generadas:', response.data);
    
    // Redirigir al cuestionario
    navigate(`/cuestionario/${subtemaId}`);
    
  } catch (error) {
    console.error('❌ Error al generar preguntas:', error);
    alert('Error al generar preguntas con IA. Por favor intenta de nuevo.');
    setLoading(false);
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
          {subtema.descripcion && (
            <p className="estudiar-descripcion">{subtema.descripcion}</p>
          )}
        </div>
      </div>

                {/* Contenido Principal */}
                <div className="estudiar-content">
                  
                  {/* Mostrar Contenidos de la BD */}
                  {contenidos.length > 0 ? (
                    <div className="contenidos-lista">
                      <h2>📖 Contenido del Tema</h2>
                      {contenidos.map((contenido, index) => (
                        <div key={contenido.id} className="contenido-card">
                          <div className="contenido-header">
                            <span className="contenido-numero">{index + 1}</span>
                            <h3>{contenido.titulo}</h3>
                            <span className={`contenido-tipo tipo-${contenido.tipo.toLowerCase()}`}>
                              {contenido.tipo}
                            </span>
                          </div>
                          <div className={`contenido-cuerpo ${contenido.tipo === 'CODIGO' ? 'codigo' : ''}`}>
                            {contenido.tipo === 'CODIGO' ? (
                              <pre><code>{contenido.cuerpo}</code></pre>
                            ) : contenido.tipo === 'IMAGEN' ? (
                              <img src={contenido.url || contenido.cuerpo} alt={contenido.titulo} />
                            ) : contenido.tipo === 'VIDEO' ? (
                              <iframe 
                                src={contenido.url || contenido.cuerpo} 
                                title={contenido.titulo}
                                width="100%"
                                height="400"
                                frameBorder="0"
                                allowFullScreen
                              ></iframe>
                            ) : (
                              <p style={{ whiteSpace: 'pre-line' }}>{contenido.cuerpo}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="contenido-card empty">
                      <p>😔 Este subtema aún no tiene contenidos.</p>
                      <p style={{ fontSize: '0.9rem', color: '#666' }}>
                        El administrador debe agregar contenidos desde el panel de administración.
                      </p>
                    </div>
                  )}

         <div className="cuestionario-section">
            <h2>🎯 Pon a Prueba lo Aprendido</h2>
            
            {contenidos.length > 0 ? (
              <>
                <p>Genera un cuestionario personalizado basado en este contenido</p>
                
                <button 
                  onClick={handleGenerarYResolver}
                  className="btn-cuestionario-ia"
                >
                  🤖 Generar Cuestionario con IA
                </button>
                
                <p className="nota-ia">
                  ⏳ La IA generará 5 preguntas únicas basadas en el contenido (~10 segundos)
                </p>
              </>
            ) : (
              <p className="advertencia">
                ⚠️ Este subtema aún no tiene contenidos
              </p>
            )}
          </div>
      </div>
    </div>
  );
};

export default EstudiarSubtema;