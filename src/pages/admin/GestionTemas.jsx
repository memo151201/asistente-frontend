// src/pages/admin/GestionTemas.jsx

import { useState, useEffect } from 'react';
import apiService from '../../services/apiService';
import './Admin.css';

const GestionTemas = () => {
  const [temas, setTemas] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [temaEdit, setTemaEdit] = useState(null);
  
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    orden: 1,
    materiaId: ''
  });

  useEffect(() => {
    cargarMaterias();
    cargarTemas();
  }, []);

  const cargarMaterias = async () => {
    try {
      const response = await apiService.getMaterias();
      setMaterias(response.data);
    } catch (error) {
      console.error('Error al cargar materias:', error);
    }
  };

  const cargarTemas = async () => {
    try {
      const response = await apiService.getTemas();
      setTemas(response.data);
    } catch (error) {
      console.error('Error al cargar temas:', error);
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
    
    if (!formData.materiaId) {
      alert('Por favor selecciona una materia');
      return;
    }

    try {
      const dataToSend = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        orden: parseInt(formData.orden),
        materia: {
          id: parseInt(formData.materiaId)
        }
      };

      if (temaEdit) {
        await apiService.actualizarTema(temaEdit.id, dataToSend);
        alert('Tema actualizado exitosamente');
      } else {
        await apiService.crearTema(dataToSend);
        alert('Tema creado exitosamente');
      }
      
      setFormData({
        nombre: '',
        descripcion: '',
        orden: 1,
        materiaId: ''
      });
      setMostrarForm(false);
      setTemaEdit(null);
      cargarTemas();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar el tema');
    }
  };

  const handleEditar = (tema) => {
    setTemaEdit(tema);
    setFormData({
      nombre: tema.nombre,
      descripcion: tema.descripcion,
      orden: tema.orden,
      materiaId: tema.materia?.id.toString() || ''
    });
    setMostrarForm(true);
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este tema?')) {
      try {
        await apiService.eliminarTema(id);
        alert('Tema eliminado');
        cargarTemas();
      } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar el tema');
      }
    }
  };

  return (
    <div className="gestion-container">
      <div className="gestion-header">
        <h1>Gestión de Temas</h1>
        <button 
          className="btn-crear"
          onClick={() => {
            setMostrarForm(!mostrarForm);
            setTemaEdit(null);
            setFormData({
              nombre: '',
              descripcion: '',
              orden: 1,
              materiaId: ''
            });
          }}
        >
          {mostrarForm ? 'Cancelar' : '+ Nuevo Tema'}
        </button>
      </div>

      {mostrarForm && (
        <div className="form-container">
          <h2>{temaEdit ? 'Editar Tema' : 'Nuevo Tema'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Materia:</label>
              <select
                name="materiaId"
                value={formData.materiaId}
                onChange={handleChange}
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
              <label>Nombre del Tema:</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                placeholder="Variables y Tipos de Datos"
              />
            </div>

            <div className="form-group">
              <label>Descripción:</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                required
                placeholder="Descripción del tema"
                rows="4"
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
              {temaEdit ? 'Actualizar' : 'Crear'} Tema
            </button>
          </form>
        </div>
      )}

      <div className="lista-container">
        <h2>Temas ({temas.length})</h2>
        <div className="tabla-responsive">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Materia</th>
                <th>Orden</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {temas.map((tema) => (
                <tr key={tema.id}>
                  <td>{tema.nombre}</td>
                  <td>{tema.materia?.nombre || 'N/A'}</td>
                  <td>{tema.orden}</td>
                  <td className="acciones">
                    <button 
                      className="btn-editar"
                      onClick={() => handleEditar(tema)}
                    >
                      ✏️ Editar
                    </button>
                    <button 
                      className="btn-eliminar"
                      onClick={() => handleEliminar(tema.id)}
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

export default GestionTemas;