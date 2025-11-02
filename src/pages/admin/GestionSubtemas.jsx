// src/pages/admin/GestionSubtemas.jsx

import { useState, useEffect } from 'react';
import apiService from '../../services/apiService';
import './Admin.css';

const GestionSubtemas = () => {
  const [subtemas, setSubtemas] = useState([]);
  const [temas, setTemas] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [subtemaEdit, setSubtemaEdit] = useState(null);
  const [materiaSeleccionada, setMateriaSeleccionada] = useState('');
  
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    orden: 1,
    temaId: ''
  });

  useEffect(() => {
    cargarMaterias();
    cargarSubtemas();
  }, []);

  const cargarMaterias = async () => {
    try {
      const response = await apiService.getMaterias();
      setMaterias(response.data);
    } catch (error) {
      console.error('Error al cargar materias:', error);
    }
  };

  const cargarSubtemas = async () => {
    try {
      const response = await apiService.getSubtemas();
      setSubtemas(response.data);
    } catch (error) {
      console.error('Error al cargar subtemas:', error);
    }
  };

  const cargarTemasPorMateria = async (materiaId) => {
    try {
      const response = await apiService.getTemasByMateria(materiaId);
      setTemas(response.data);
    } catch (error) {
      console.error('Error al cargar temas:', error);
    }
  };

  const handleMateriaChange = (e) => {
    const materiaId = e.target.value;
    setMateriaSeleccionada(materiaId);
    if (materiaId) {
      cargarTemasPorMateria(materiaId);
    } else {
      setTemas([]);
    }
    setFormData({ ...formData, temaId: '' });
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
    
    if (!formData.temaId) {
      alert('Por favor selecciona un tema');
      return;
    }

    try {
      const dataToSend = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        orden: parseInt(formData.orden),
        tema: {
          id: parseInt(formData.temaId)
        }
      };

      if (subtemaEdit) {
        await apiService.actualizarSubtema(subtemaEdit.id, dataToSend);
        alert('Subtema actualizado exitosamente');
      } else {
        await apiService.crearSubtema(dataToSend);
        alert('Subtema creado exitosamente');
      }
      
      setFormData({
        nombre: '',
        descripcion: '',
        orden: 1,
        temaId: ''
      });
      setMostrarForm(false);
      setSubtemaEdit(null);
      setMateriaSeleccionada('');
      setTemas([]);
      cargarSubtemas();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar el subtema');
    }
  };

  const handleEditar = async (subtema) => {
    setSubtemaEdit(subtema);
    
    // Cargar la materia y temas del subtema
    if (subtema.tema && subtema.tema.materia) {
      setMateriaSeleccionada(subtema.tema.materia.id.toString());
      await cargarTemasPorMateria(subtema.tema.materia.id);
    }
    
    setFormData({
      nombre: subtema.nombre,
      descripcion: subtema.descripcion,
      orden: subtema.orden,
      temaId: subtema.tema?.id.toString() || ''
    });
    setMostrarForm(true);
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este subtema?')) {
      try {
        await apiService.eliminarSubtema(id);
        alert('Subtema eliminado');
        cargarSubtemas();
      } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar el subtema');
      }
    }
  };

  return (
    <div className="gestion-container">
      <div className="gestion-header">
        <h1>Gestión de Subtemas</h1>
        <button 
          className="btn-crear"
          onClick={() => {
            setMostrarForm(!mostrarForm);
            setSubtemaEdit(null);
            setMateriaSeleccionada('');
            setTemas([]);
            setFormData({
              nombre: '',
              descripcion: '',
              orden: 1,
              temaId: ''
            });
          }}
        >
          {mostrarForm ? 'Cancelar' : '+ Nuevo Subtema'}
        </button>
      </div>

      {mostrarForm && (
        <div className="form-container">
          <h2>{subtemaEdit ? 'Editar Subtema' : 'Nuevo Subtema'}</h2>
          <form onSubmit={handleSubmit}>
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
                name="temaId"
                value={formData.temaId}
                onChange={handleChange}
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
              <label>Nombre del Subtema:</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                placeholder="Declaración de Variables"
              />
            </div>

            <div className="form-group">
              <label>Descripción:</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                required
                placeholder="Descripción del subtema"
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
              {subtemaEdit ? 'Actualizar' : 'Crear'} Subtema
            </button>
          </form>
        </div>
      )}

      <div className="lista-container">
        <h2>Subtemas ({subtemas.length})</h2>
        <div className="tabla-responsive">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Tema</th>
                <th>Materia</th>
                <th>Orden</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {subtemas.map((subtema) => (
                <tr key={subtema.id}>
                  <td>{subtema.nombre}</td>
                  <td>{subtema.tema?.nombre || 'N/A'}</td>
                  <td>{subtema.tema?.materia?.nombre || 'N/A'}</td>
                  <td>{subtema.orden}</td>
                  <td className="acciones">
                    <button 
                      className="btn-editar"
                      onClick={() => handleEditar(subtema)}
                    >
                      ✏️ Editar
                    </button>
                    <button 
                      className="btn-eliminar"
                      onClick={() => handleEliminar(subtema.id)}
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

export default GestionSubtemas;