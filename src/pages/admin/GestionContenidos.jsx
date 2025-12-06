// src/pages/admin/GestionContenidos.jsx

import { useState, useEffect } from 'react';
import apiService from '../../services/apiService';
import './Admin.css';

const GestionContenidos = () => {
  const [contenidos, setContenidos] = useState([]);
  const [subtemas, setSubtemas] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [contenidoEdit, setContenidoEdit] = useState(null);
  const [subtemaFiltro, setSubtemaFiltro] = useState('');
  
  const [formData, setFormData] = useState({
    titulo: '',
    tipo: 'TEXTO',
    cuerpo: '',
    orden: 1,
    subtemaId: ''
  });

  useEffect(() => {
    cargarSubtemas();
  }, []);

  useEffect(() => {
    if (subtemaFiltro) {
      cargarContenidosPorSubtema(subtemaFiltro);
    } else {
      setContenidos([]);
    }
  }, [subtemaFiltro]);

  const cargarSubtemas = async () => {
    try {
      const response = await apiService.getSubtemas();
      setSubtemas(response.data);
    } catch (error) {
      console.error('Error al cargar subtemas:', error);
    }
  };

  const cargarContenidosPorSubtema = async (subtemaId) => {
    try {
      const response = await apiService.getContenidosBySubtema(subtemaId);
      setContenidos(response.data);
    } catch (error) {
      console.error('Error al cargar contenidos:', error);
      setContenidos([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
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
        titulo: formData.titulo,
        tipo: formData.tipo,
        cuerpo: formData.cuerpo,
        orden: parseInt(formData.orden),
        subtema: {
          id: parseInt(formData.subtemaId)
        }
      };

      if (contenidoEdit) {
        await apiService.actualizarContenido(contenidoEdit.id, dataToSend);
        alert('Contenido actualizado exitosamente');
      } else {
        await apiService.crearContenido(dataToSend);
        alert('Contenido creado exitosamente');
      }
      
      setFormData({
        titulo: '',
        tipo: 'TEXTO',
        cuerpo: '',
        orden: 1,
        subtemaId: ''
      });
      setMostrarForm(false);
      setContenidoEdit(null);
      
      if (subtemaFiltro) {
        cargarContenidosPorSubtema(subtemaFiltro);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar el contenido');
    }
  };

  const handleEditar = (contenido) => {
    setContenidoEdit(contenido);
    setFormData({
      titulo: contenido.titulo,
      tipo: contenido.tipo,
      cuerpo: contenido.cuerpo,
      orden: contenido.orden,
      subtemaId: contenido.subtema?.id?.toString() || ''
    });
    setMostrarForm(true);
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este contenido?')) {
      try {
        await apiService.eliminarContenido(id);
        alert('Contenido eliminado');
        if (subtemaFiltro) {
          cargarContenidosPorSubtema(subtemaFiltro);
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar el contenido');
      }
    }
  };

  

  return (
    <div className="gestion-container">
      <div className="gestion-header">
        <h1>Gestión de Contenidos</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
         
          <button 
            className="btn-crear"
            onClick={() => {
              setMostrarForm(!mostrarForm);
              setContenidoEdit(null);
              setFormData({
                titulo: '',
                tipo: 'TEXTO',
                cuerpo: '',
                orden: 1,
                subtemaId: subtemaFiltro || ''
              });
            }}
            disabled={!subtemaFiltro}
          >
            {mostrarForm ? 'Cancelar' : '+ Nuevo Contenido'}
          </button>
        </div>
      </div>

      <div className="filtro-container" style={{ marginBottom: '20px' }}>
        <label style={{ fontWeight: 'bold', marginRight: '10px' }}>
          Filtrar por Subtema:
        </label>
        <select
          value={subtemaFiltro}
          onChange={(e) => setSubtemaFiltro(e.target.value)}
          style={{
            padding: '8px',
            borderRadius: '5px',
            border: '1px solid #ddd',
            minWidth: '300px'
          }}
        >
          <option value="">Selecciona un subtema</option>
          {subtemas.map((subtema) => (
            <option key={subtema.id} value={subtema.id}>
              {subtema.nombre} ({subtema.tema?.nombre})
            </option>
          ))}
        </select>
      </div>

      {mostrarForm && (
        <div className="form-container">
          <h2>{contenidoEdit ? 'Editar Contenido' : 'Nuevo Contenido'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Subtema:</label>
              <select
                name="subtemaId"
                value={formData.subtemaId}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona un subtema</option>
                {subtemas.map((subtema) => (
                  <option key={subtema.id} value={subtema.id}>
                    {subtema.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Título:</label>
              <input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                required
                placeholder="Título del contenido"
              />
            </div>

            <div className="form-group">
              <label>Tipo:</label>
              <select
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                required
              >
                <option value="TEXTO">Texto</option>
                <option value="CODIGO">Código</option>
                <option value="IMAGEN">Imagen</option>
                <option value="VIDEO">Video</option>
              </select>
            </div>

            <div className="form-group">
              <label>Contenido:</label>
              <textarea
                name="cuerpo"
                value={formData.cuerpo}
                onChange={handleChange}
                required
                placeholder="Escribe el contenido aquí..."
                rows="10"
                style={{ fontFamily: formData.tipo === 'CODIGO' ? 'monospace' : 'inherit' }}
              />
            </div>

            <div className="form-group">
              <label>Orden:</label>
              <input
                type="number"
                name="orden"
                value={formData.orden}
                onChange={handleChange}
                required
                min="1"
              />
            </div>

            <button type="submit" className="btn-guardar">
              {contenidoEdit ? 'Actualizar' : 'Crear'} Contenido
            </button>
          </form>
        </div>
      )}

      {subtemaFiltro && (
        <div className="lista-container">
          <h2>Contenidos ({contenidos.length})</h2>
          {contenidos.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
              No hay contenidos para este subtema. ¡Crea el primero!
            </p>
          ) : (
            <div className="tabla-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Orden</th>
                    <th>Título</th>
                    <th>Tipo</th>
                    <th>Contenido</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {contenidos.map((contenido) => (
                    <tr key={contenido.id}>
                      <td>{contenido.orden}</td>
                      <td>{contenido.titulo}</td>
                      <td>
                        <span 
                          style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            backgroundColor: 
                              contenido.tipo === 'CODIGO' ? '#f0f0f0' :
                              contenido.tipo === 'IMAGEN' ? '#e3f2fd' :
                              contenido.tipo === 'VIDEO' ? '#fce4ec' : '#f1f8e9',
                            fontSize: '12px'
                          }}
                        >
                          {contenido.tipo}
                        </span>
                      </td>
                      <td>
                        <div style={{ 
                          maxWidth: '300px', 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {contenido.cuerpo}
                        </div>
                      </td>
                      <td className="acciones">
                        <button 
                          className="btn-editar"
                          onClick={() => handleEditar(contenido)}
                        >
                          ✏️ Editar
                        </button>
                        <button 
                          className="btn-eliminar"
                          onClick={() => handleEliminar(contenido.id)}
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
    </div>
  );
};

export default GestionContenidos;