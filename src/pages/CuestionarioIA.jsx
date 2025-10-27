// src/pages/CuestionarioIA.jsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Pages.css';

const API_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api` 
  : 'http://localhost:8080/api';

const CuestionarioIA = () => {
  const { subtemaId } = useParams();
  const navigate = useNavigate();
  
  // Estados
  const [subtema, setSubtema] = useState(null);
  const [preguntas, setPreguntas] = useState([]);
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState(null);
  const [respondida, setRespondida] = useState(false);
  const [esCorrecta, setEsCorrecta] = useState(false);
  const [respuestasGuardadas, setRespuestasGuardadas] = useState([]);
  const [cuestionarioCompletado, setCuestionarioCompletado] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    generarCuestionario();
  }, [subtemaId]);

  const generarCuestionario = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      // Obtener subtema
      const subtemaResponse = await axios.get(`${API_URL}/subtemas/${subtemaId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubtema(subtemaResponse.data);

      // Generar preguntas con IA
      console.log('🤖 Generando preguntas con IA...');
      const preguntasResponse = await axios.post(
        `${API_URL}/ia/generar-preguntas/${subtemaId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      console.log('✅ Preguntas generadas:', preguntasResponse.data.preguntas);
      setPreguntas(preguntasResponse.data.preguntas);
      setLoading(false);
    } catch (err) {
      console.error('Error al generar cuestionario:', err);
      setError('Error al generar el cuestionario con IA');
      setLoading(false);
    }
  };

  const handleSeleccionarRespuesta = (opcion) => {
    if (!respondida) {
      setRespuestaSeleccionada(opcion);
    }
  };

  const handleResponder = () => {
    if (!respuestaSeleccionada) {
      alert('Por favor selecciona una respuesta');
      return;
    }

    const pregunta = preguntas[preguntaActual];
    const correcta = respuestaSeleccionada === pregunta.respuestaCorrecta;
    setEsCorrecta(correcta);
    setRespondida(true);

    // Guardar en estado local
    setRespuestasGuardadas([...respuestasGuardadas, {
      pregunta: pregunta.enunciado,
      respuestaUsuario: respuestaSeleccionada,
      correcta: correcta,
      explicacion: pregunta.explicacion
    }]);
  };

  const handleSiguiente = () => {
    if (preguntaActual < preguntas.length - 1) {
      setPreguntaActual(preguntaActual + 1);
      setRespuestaSeleccionada(null);
      setRespondida(false);
      setEsCorrecta(false);
    } else {
      setCuestionarioCompletado(true);
    }
  };

  const handleAnterior = () => {
    if (preguntaActual > 0) {
      setPreguntaActual(preguntaActual - 1);
      setRespuestaSeleccionada(null);
      setRespondida(false);
      setEsCorrecta(false);
    }
  };

  const handleVolver = () => {
    navigate(`/estudiar/${subtemaId}`);
  };

  const calcularPuntaje = () => {
    const correctas = respuestasGuardadas.filter(r => r.correcta).length;
    const total = respuestasGuardadas.length;
    const porcentaje = total > 0 ? Math.round((correctas / total) * 100) : 0;
    return { correctas, total, porcentaje };
  };

  // Loading
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>🤖 La IA está generando preguntas personalizadas...</p>
        <p style={{fontSize: '0.9rem', color: '#666', marginTop: '1rem'}}>
          Esto puede tardar 5-10 segundos
        </p>
      </div>
    );
  }

  // Error
  if (error || !subtema) {
    return (
      <div className="error-container">
        <p>⚠️ {error || 'No se pudo generar el cuestionario'}</p>
        <button onClick={handleVolver} className="btn-primary">
          ← Volver
        </button>
      </div>
    );
  }

  // Sin preguntas
  if (preguntas.length === 0) {
    return (
      <div className="cuestionario-container">
        <div className="cuestionario-header">
          <button onClick={handleVolver} className="btn-back">
            ← Volver
          </button>
          <h1>🤖 {subtema.nombre}</h1>
        </div>
        <div className="empty-state">
          <p>😔 No se pudieron generar preguntas con IA</p>
          <button onClick={handleVolver} className="btn-primary">
            Intentar de Nuevo
          </button>
        </div>
      </div>
    );
  }

  // Cuestionario completado
  if (cuestionarioCompletado) {
    const { correctas, total, porcentaje } = calcularPuntaje();
    
    return (
      <div className="cuestionario-container">
        <div className="resumen-container">
          <h1>🎉 ¡Cuestionario Completado!</h1>
          <p className="resumen-badge">🤖 Generado con IA</p>
          
          <div className="resumen-puntaje">
            <div className="puntaje-grande">{porcentaje}%</div>
            <p className="puntaje-texto">Tu puntaje</p>
          </div>

          <div className="resumen-stats">
            <div className="stat-item correctas">
              <span className="stat-numero">{correctas}</span>
              <span className="stat-label">Correctas</span>
            </div>
            <div className="stat-item incorrectas">
              <span className="stat-numero">{total - correctas}</span>
              <span className="stat-label">Incorrectas</span>
            </div>
            <div className="stat-item total">
              <span className="stat-numero">{total}</span>
              <span className="stat-label">Total</span>
            </div>
          </div>

          <div className="resumen-mensaje">
            {porcentaje >= 80 && <p>🌟 ¡Excelente trabajo! Dominas este tema.</p>}
            {porcentaje >= 60 && porcentaje < 80 && <p>👍 ¡Buen trabajo! Sigue practicando.</p>}
            {porcentaje < 60 && <p>📚 Te recomendamos repasar este tema.</p>}
          </div>

          <div className="resumen-acciones">
            <button onClick={handleVolver} className="btn-secondary">
              ← Volver a Estudiar
            </button>
            <button onClick={() => window.location.reload()} className="btn-primary">
              🔄 Generar Nuevo Cuestionario
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar pregunta actual
  const pregunta = preguntas[preguntaActual];
  const opciones = [
    { letra: 'A', texto: pregunta.opcionA },
    { letra: 'B', texto: pregunta.opcionB },
    { letra: 'C', texto: pregunta.opcionC },
    { letra: 'D', texto: pregunta.opcionD }
  ];

  return (
    <div className="cuestionario-container">
      {/* Header */}
      <div className="cuestionario-header">
        <button onClick={handleVolver} className="btn-back">
          ← Volver
        </button>
        <div className="cuestionario-info">
          <h1>🤖 {subtema.nombre}</h1>
          <p className="progreso">
            Pregunta {preguntaActual + 1} de {preguntas.length} 
            <span className="ia-badge">Generado con IA</span>
          </p>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="barra-progreso">
        <div 
          className="barra-progreso-fill ia-gradient"
          style={{ width: `${((preguntaActual + 1) / preguntas.length) * 100}%` }}
        ></div>
      </div>

      {/* Pregunta */}
      <div className="pregunta-container">
        <div className="pregunta-card">
          <h2 className="pregunta-texto">{pregunta.enunciado}</h2>
          
          {/* Opciones */}
          <div className="opciones-container">
            {opciones.map((opcion) => (
              <div
                key={opcion.letra}
                className={`opcion ${
                  respuestaSeleccionada === opcion.letra ? 'seleccionada' : ''
                } ${
                  respondida && opcion.letra === pregunta.respuestaCorrecta ? 'correcta' : ''
                } ${
                  respondida && respuestaSeleccionada === opcion.letra && !esCorrecta ? 'incorrecta' : ''
                }`}
                onClick={() => handleSeleccionarRespuesta(opcion.letra)}
              >
                <div className="opcion-letra">{opcion.letra}</div>
                <div className="opcion-texto">{opcion.texto}</div>
              </div>
            ))}
          </div>

          {/* Retroalimentación */}
          {respondida && (
            <div className={`retroalimentacion ${esCorrecta ? 'correcta' : 'incorrecta'}`}>
              <div className="retroalimentacion-icono">
                {esCorrecta ? '✅' : '❌'}
              </div>
              <div className="retroalimentacion-contenido">
                <h3>{esCorrecta ? '¡Correcto!' : 'Incorrecto'}</h3>
                <p>{pregunta.explicacion}</p>
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="acciones-container">
            {!respondida ? (
              <button 
                onClick={handleResponder}
                className="btn-responder"
                disabled={!respuestaSeleccionada}
              >
                Responder
              </button>
            ) : (
              <div className="navegacion-container">
                <button 
                  onClick={handleAnterior}
                  className="btn-navegacion"
                  disabled={preguntaActual === 0}
                >
                  ← Anterior
                </button>
                <button 
                  onClick={handleSiguiente}
                  className="btn-navegacion btn-siguiente"
                >
                  {preguntaActual < preguntas.length - 1 ? 'Siguiente →' : 'Finalizar ✓'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CuestionarioIA;