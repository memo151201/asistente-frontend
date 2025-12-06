// src/pages/admin/GestionEjercicios.jsx

import { useState, useEffect } from 'react';
import apiService from '../../services/apiService';
import './Admin.css';

const GestionEjercicios = () => {
  const [ejercicios, setEjercicios] = useState([]);
  const [subtemas, setSubtemas] = useState([]);
  const [subtemaSeleccionado, setSubtemaSeleccionado] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);
  const [ejercicioEdit, setEjercicioEdit] = useState(null);
  
  const [formData, setFormData] = useState({
    enunciado: '',
    descripcion: '',
    tipo: 'CODIGO',
    nivelDificultad: 'MEDIO',
    solucionReferencia: '',
    subtemaId: ''
  });

  // Cargar subtemas al inicio
  useEffect(() => {
    cargarSubtemas();
  }, []);

  // Cargar ejercicios cuando se selecciona un subtema
  useEffect(() => {
    if (subtemaSeleccionado) {
      cargarEjercicios(subtemaSeleccionado);
      setFormData(prev => ({ ...prev, subtemaId: subtemaSeleccionado }));
    }
  }, [subtemaSeleccionado]);

  const cargarSubtemas = async () => {
    try {
      const response = await apiService.getSubtemas();
      setSubtemas(response.data);
    } catch (error) {
      console.error('Error al cargar subtemas:', error);
    }
  };

  const cargarEjercicios = async (subtemaId) => {
    try {
      const response = await apiService.getEjerciciosBySubtema(subtemaId);
      setEjercicios(response.data);
    } catch (error) {
      console.error('Error al cargar ejercicios:', error);
      setEjercicios([]);
    }
  };

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Crear o actualizar ejercicio
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!subtemaSeleccionado) {
      alert('Por favor selecciona un subtema primero');
      return;
    }

    try {
      // Formatear datos según el backend espera
      const dataToSend = {
        enunciado: formData.enunciado,
        descripcion: formData.descripcion,
        tipo: formData.tipo,
        nivelDificultad: formData.nivelDificultad,
        solucionReferencia: formData.solucionReferencia,
        subtema: {
          id: parseInt(formData.subtemaId)
        }
      };

      if (ejercicioEdit) {
        // Actualizar
        await apiService.actualizarEjercicio(ejercicioEdit.id, dataToSend);
        alert('Ejercicio actualizado exitosamente');
      } else {
        // Crear
        await apiService.crearEjercicio(dataToSend);
        alert('Ejercicio creado exitosamente');
      }
      
      // Resetear formulario
      setFormData({
        enunciado: '',
        descripcion: '',
        tipo: 'CODIGO',
        nivelDificultad: 'MEDIO',
        solucionReferencia: '',
        subtemaId: subtemaSeleccionado
      });
      setMostrarForm(false);
      setEjercicioEdit(null);
      cargarEjercicios(subtemaSeleccionado);
    } catch (error) {
      console.error('Error completo:', error);
      console.error('Respuesta del servidor:', error.response?.data);
      alert('Error al guardar el ejercicio: ' + (error.response?.data?.message || error.message));
    }
  };

  // Editar ejercicio
  const handleEditar = (ejercicio) => {
    setEjercicioEdit(ejercicio);
    setFormData({
      enunciado: ejercicio.enunciado,
      descripcion: ejercicio.descripcion || '',
      tipo: ejercicio.tipo,
      nivelDificultad: ejercicio.nivelDificultad,
      solucionReferencia: ejercicio.solucionReferencia || '',
      subtemaId: ejercicio.subtema.id
    });
    setMostrarForm(true);
  };

  // Eliminar ejercicio
  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este ejercicio?')) {
      try {
        await apiService.eliminarEjercicio(id);
        alert('Ejercicio eliminado');
        cargarEjercicios(subtemaSeleccionado);
      } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar el ejercicio');
      }
    }
  };

  const obtenerNombreSubtema = (subtemaId) => {
    const subtema = subtemas.find(s => s.id === parseInt(subtemaId));
    return subtema ? subtema.nombre : 'Desconocido';
  };

  return (
    <div className="gestion-container">
      <div className="gestion-header">
        <h1>Gestión de Ejercicios</h1>
        <button 
          className="btn-crear"
          onClick={() => {
            if (!subtemaSeleccionado) {
              alert('Por favor selecciona un subtema primero');
              return;
            }
            setMostrarForm(!mostrarForm);
            setEjercicioEdit(null);
            setFormData({
              enunciado: '',
              descripcion: '',
              tipo: 'CODIGO',
              nivelDificultad: 'MEDIO',
              solucionReferencia: '',
              subtemaId: subtemaSeleccionado
            });
          }}
        >
          {mostrarForm ? 'Cancelar' : '+ Nuevo Ejercicio'}
        </button>
      </div>

      {/* SELECTOR DE SUBTEMA */}
      <div className="filtro-container">
        <label>Seleccionar Subtema:</label>
        <select 
          value={subtemaSeleccionado} 
          onChange={(e) => setSubtemaSeleccionado(e.target.value)}
          className="select-filtro"
        >
          <option value="">-- Selecciona un Subtema --</option>
          {subtemas.map((subtema) => (
            <option key={subtema.id} value={subtema.id}>
              {subtema.nombre} (Tema: {subtema.tema?.nombre || 'N/A'})
            </option>
          ))}
        </select>
      </div>

      {/* FORMULARIO */}
      {mostrarForm && (
        <div className="form-container">
          <h2>{ejercicioEdit ? 'Editar Ejercicio' : 'Nuevo Ejercicio'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Enunciado:*</label>
              <textarea
                name="enunciado"
                value={formData.enunciado}
                onChange={handleChange}
                required
                placeholder="Escribe el enunciado del ejercicio..."
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Descripción:</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Descripción adicional del ejercicio (opcional)"
                rows="4"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Tipo de Ejercicio:*</label>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  required
                >
                  <option value="CODIGO">Código</option>
                  <option value="PROBLEMA">Problema</option>
                  <option value="TEXTO_LIBRE">Texto Libre</option>
                  <option value="ANALISIS">Análisis</option>
                  <option value="SQL">SQL</option>
                </select>
              </div>

              <div className="form-group">
                <label>Nivel de Dificultad:*</label>
                <select
                  name="nivelDificultad"
                  value={formData.nivelDificultad}
                  onChange={handleChange}
                  required
                >
                  <option value="FACIL">Fácil</option>
                  <option value="MEDIO">Medio</option>
                  <option value="DIFICIL">Difícil</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Solución de Referencia:</label>
              <textarea
                name="solucionReferencia"
                value={formData.solucionReferencia}
                onChange={handleChange}
                placeholder="Solución o guía de referencia (opcional)"
                rows="5"
              />
            </div>

            <div className="form-info">
              <strong>Subtema seleccionado:</strong> {obtenerNombreSubtema(subtemaSeleccionado)}
            </div>

            <button type="submit" className="btn-guardar">
              {ejercicioEdit ? 'Actualizar' : 'Crear'} Ejercicio
            </button>
          </form>
        </div>
      )}

      {/* LISTA DE EJERCICIOS */}
      {subtemaSeleccionado && (
        <div className="lista-container">
          <h2>Ejercicios del Subtema: {obtenerNombreSubtema(subtemaSeleccionado)} ({ejercicios.length})</h2>
          
          {ejercicios.length === 0 ? (
            <div className="empty-state">
              <p>📝 No hay ejercicios para este subtema</p>
              <p className="empty-subtitle">Crea el primer ejercicio usando el botón "+ Nuevo Ejercicio"</p>
            </div>
          ) : (
            <div className="tabla-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Enunciado</th>
                    <th>Tipo</th>
                    <th>Dificultad</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {ejercicios.map((ejercicio) => (
                    <tr key={ejercicio.id}>
                      <td>
                        <div className="ejercicio-enunciado">
                          {ejercicio.enunciado.substring(0, 100)}
                          {ejercicio.enunciado.length > 100 ? '...' : ''}
                        </div>
                      </td>
                      <td>
                        <span className={`badge badge-tipo-${ejercicio.tipo.toLowerCase()}`}>
                          {ejercicio.tipo}
                        </span>
                      </td>
                      <td>
                        <span className={`badge badge-${ejercicio.nivelDificultad.toLowerCase()}`}>
                          {ejercicio.nivelDificultad}
                        </span>
                      </td>
                      <td className="acciones">
                        <button 
                          className="btn-editar"
                          onClick={() => handleEditar(ejercicio)}
                        >
                          ✏️ Editar
                        </button>
                        <button 
                          className="btn-eliminar"
                          onClick={() => handleEliminar(ejercicio.id)}
                        >
                          🗑️ Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {!subtemaSeleccionado && (
        <div className="empty-state">
          <p>👆 Selecciona un subtema para ver sus ejercicios</p>
        </div>
      )}
    </div>
  );
};

export default GestionEjercicios;