// src/pages/admin/GestionPreguntas.jsx

import { useState, useEffect } from 'react';
import apiService from '../../services/apiService';
import './Admin.css';

const GestionPreguntas = () => {
  const [preguntas, setPreguntas] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [temas, setTemas] = useState([]);
  const [subtemas, setSubtemas] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [preguntaEdit, setPreguntaEdit] = useState(null);
  const [materiaSeleccionada, setMateriaSeleccionada] = useState('');
  const [temaSeleccionado, setTemaSeleccionado] = useState('');
  
  const [formData, setFormData] = useState({
    textoPregunta: '',
    opcionA: '',
    opcionB: '',
    opcionC: '',
    opcionD: '',
    respuestaCorrecta: 'A',
    explicacion: '',
    nivelDificultad: 'FACIL',
    activa: true,
    subtemaId: ''
  });

  useEffect(() => {
    cargarMaterias();
    cargarPreguntas();
  }, []);

  const cargarMaterias = async () => {
    try {
      const response = await apiService.getMaterias();
      setMaterias(response.data);
    } catch (error) {
      console.error('Error al cargar materias:', error);
    }
  };

  const cargarPreguntas = async () => {
    try {
      const response = await apiService.getPreguntas();
      setPreguntas(response.data);
    } catch (error) {
      console.error('Error al cargar preguntas:', error);
    }
  };

  const cargarTemasPorMateria = async (materiaId) => {
    try {
      const response = await apiService.getTemasByMateria(materiaId);
      setTemas(response.data);
      setSubtemas([]);
    } catch (error) {
      console.error('Error al cargar temas:', error);
    }
  };

  const cargarSubtemasPorTema = async (temaId) => {
    try {
      const response = await apiService.getSubtemasByTema(temaId);
      setSubtemas(response.data);
    } catch (error) {
      console.error('Error al cargar subtemas:', error);
    }
  };

  const handleMateriaChange = (e) => {
    const materiaId = e.target.value;
    setMateriaSeleccionada(materiaId);
    setTemaSeleccionado('');
    setTemas([]);
    setSubtemas([]);
    setFormData({ ...formData, subtemaId: '' });
    
    if (materiaId) {
      cargarTemasPorMateria(materiaId);
    }
  };

  const handleTemaChange = (e) => {
    const temaId = e.target.value;
    setTemaSeleccionado(temaId);
    setSubtemas([]);
    setFormData({ ...formData, subtemaId: '' });
    
    if (temaId) {
      cargarSubtemasPorTema(temaId);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.subtemaId) {
      alert('Por favor selecciona un subtema');
      return;
    }

    try {
      const dataToSend = {
        textoPregunta: formData.textoPregunta,
        opcionA: formData.opcionA,
        opcionB: formData.opcionB,
        opcionC: formData.opcionC,
        opcionD: formData.opcionD,
        respuestaCorrecta: formData.respuestaCorrecta,
        explicacion: formData.explicacion,
        nivelDificultad: formData.nivelDificultad,
        activa: formData.activa,
        subtema: {
          id: parseInt(formData.subtemaId)
        }
      };

      if (preguntaEdit) {
        await apiService.actualizarPregunta(preguntaEdit.id, dataToSend);
        alert('Pregunta actualizada exitosamente');
      } else {
        await apiService.crearPregunta(dataToSend);
        alert('Pregunta creada exitosamente');
      }
      
      resetForm();
      cargarPreguntas();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar la pregunta');
    }
  };

  const resetForm = () => {
    setFormData({
      textoPregunta: '',
      opcionA: '',
      opcionB: '',
      opcionC: '',
      opcionD: '',
      respuestaCorrecta: 'A',
      explicacion: '',
      nivelDificultad: 'FACIL',
      activa: true,
      subtemaId: ''
    });
    setMostrarForm(false);
    setPreguntaEdit(null);
    setMateriaSeleccionada('');
    setTemaSeleccionado('');
    setTemas([]);
    setSubtemas([]);
  };

  const handleEditar = async (pregunta) => {
    setPreguntaEdit(pregunta);
    
    // Cargar la cadena: materia -> tema -> subtema
    if (pregunta.subtema?.tema?.materia) {
      const materiaId = pregunta.subtema.tema.materia.id;
      const temaId = pregunta.subtema.tema.id;
      
      setMateriaSeleccionada(materiaId.toString());
      await cargarTemasPorMateria(materiaId);
      
      setTemaSeleccionado(temaId.toString());
      await cargarSubtemasPorTema(temaId);
    }
    
    setFormData({
      textoPregunta: pregunta.textoPregunta,
      opcionA: pregunta.opcionA,
      opcionB: pregunta.opcionB,
      opcionC: pregunta.opcionC,
      opcionD: pregunta.opcionD,
      respuestaCorrecta: pregunta.respuestaCorrecta,
      explicacion: pregunta.explicacion,
      nivelDificultad: pregunta.nivelDificultad,
      activa: pregunta.activa,
      subtemaId: pregunta.subtema?.id.toString() || ''
    });
    setMostrarForm(true);
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta pregunta?')) {
      try {
        await apiService.eliminarPregunta(id);
        alert('Pregunta eliminada');
        cargarPreguntas();
      } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar la pregunta');
      }
    }
  };

  return (
    <div className="gestion-container">
      <div className="gestion-header">
        <h1>Gestión de Preguntas</h1>
        <button 
          className="btn-crear"
          onClick={() => {
            if (mostrarForm) {
              resetForm();
            } else {
              setMostrarForm(true);
            }
          }}
        >
          {mostrarForm ? 'Cancelar' : '+ Nueva Pregunta'}
        </button>
      </div>

      {mostrarForm && (
        <div className="form-container">
          <h2>{preguntaEdit ? 'Editar Pregunta' : 'Nueva Pregunta'}</h2>
          <form onSubmit={handleSubmit}>
            {/* Selectores en cascada */}
            <div className="form-group">
              <label>Materia:</label>
              <select
                value={materiaSeleccionada}
                onChange={handleMateriaChange}
                required
              >
                <option value="">Selecciona una materia</option>
                {materias.map((materia) => (
                  <option key={materia.id} value={materia.id}>
                    {materia.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Tema:</label>
              <select
                value={temaSeleccionado}
                onChange={handleTemaChange}
                required
                disabled={!materiaSeleccionada}
              >
                <option value="">Selecciona un tema</option>
                {temas.map((tema) => (
                  <option key={tema.id} value={tema.id}>
                    {tema.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Subtema:</label>
              <select
                name="subtemaId"
                value={formData.subtemaId}
                onChange={handleChange}
                required
                disabled={!temaSeleccionado}
              >
                <option value="">Selecciona un subtema</option>
                {subtemas.map((subtema) => (
                  <option key={subtema.id} value={subtema.id}>
                    {subtema.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Pregunta */}
            <div className="form-group">
              <label>Pregunta:</label>
              <textarea
                name="textoPregunta"
                value={formData.textoPregunta}
                onChange={handleChange}
                required
                placeholder="¿Cuál es...?"
                rows="3"
              />
            </div>

            {/* Opciones */}
            <div className="form-group">
              <label>Opción A:</label>
              <input
                type="text"
                name="opcionA"
                value={formData.opcionA}
                onChange={handleChange}
                required
                placeholder="Primera opción"
              />
            </div>

            <div className="form-group">
              <label>Opción B:</label>
              <input
                type="text"
                name="opcionB"
                value={formData.opcionB}
                onChange={handleChange}
                required
                placeholder="Segunda opción"
              />
            </div>

            <div className="form-group">
              <label>Opción C:</label>
              <input
                type="text"
                name="opcionC"
                value={formData.opcionC}
                onChange={handleChange}
                required
                placeholder="Tercera opción"
              />
            </div>

            <div className="form-group">
              <label>Opción D:</label>
              <input
                type="text"
                name="opcionD"
                value={formData.opcionD}
                onChange={handleChange}
                required
                placeholder="Cuarta opción"
              />
            </div>

            {/* Respuesta correcta */}
            <div className="form-group">
              <label>Respuesta Correcta:</label>
              <select
                name="respuestaCorrecta"
                value={formData.respuestaCorrecta}
                onChange={handleChange}
                required
              >
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </div>

            {/* Explicación */}
            <div className="form-group">
              <label>Explicación:</label>
              <textarea
                name="explicacion"
                value={formData.explicacion}
                onChange={handleChange}
                required
                placeholder="Explica por qué esta es la respuesta correcta"
                rows="3"
              />
            </div>

            {/* Nivel de dificultad */}
            <div className="form-group">
              <label>Nivel de Dificultad:</label>
              <select
                name="nivelDificultad"
                value={formData.nivelDificultad}
                onChange={handleChange}
              >
                <option value="FACIL">Fácil</option>
                <option value="MEDIO">Medio</option>
                <option value="DIFICIL">Difícil</option>
              </select>
            </div>

            {/* Activa */}
            <div className="form-group-checkbox">
              <label>
                <input
                  type="checkbox"
                  name="activa"
                  checked={formData.activa}
                  onChange={handleChange}
                />
                Pregunta Activa
              </label>
            </div>

            <button type="submit" className="btn-guardar">
              {preguntaEdit ? 'Actualizar' : 'Crear'} Pregunta
            </button>
          </form>
        </div>
      )}

      {/* Lista de preguntas */}
      <div className="lista-container">
        <h2>Preguntas ({preguntas.length})</h2>
        <div className="tabla-responsive">
          <table>
            <thead>
              <tr>
                <th>Pregunta</th>
                <th>Subtema</th>
                <th>Respuesta</th>
                <th>Dificultad</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {preguntas.map((pregunta) => (
                <tr key={pregunta.id}>
                  <td style={{ maxWidth: '300px' }}>
                    {pregunta.textoPregunta.substring(0, 60)}...
                  </td>
                  <td>{pregunta.subtema?.nombre || 'N/A'}</td>
                  <td>
                    <span className="badge badge-respuesta">
                      {pregunta.respuestaCorrecta}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-${pregunta.nivelDificultad.toLowerCase()}`}>
                      {pregunta.nivelDificultad}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${pregunta.activa ? 'badge-activo' : 'badge-inactivo'}`}>
                      {pregunta.activa ? 'Activa' : 'Inactiva'}
                    </span>
                  </td>
                  <td className="acciones">
                    <button 
                      className="btn-editar"
                      onClick={() => handleEditar(pregunta)}
                    >
                      ✏️ Editar
                    </button>
                    <button 
                      className="btn-eliminar"
                      onClick={() => handleEliminar(pregunta.id)}
                    >
                      🗑️ Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GestionPreguntas;