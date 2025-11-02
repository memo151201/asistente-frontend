// src/pages/admin/GestionMaterias.jsx

import { useState, useEffect } from 'react';
import apiService from '../../services/apiService';
import './Admin.css';

const GestionMaterias = () => {
  const [materias, setMaterias] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [materiaEdit, setMateriaEdit] = useState(null);
  
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    nivelDificultad: 'FACIL',
    activa: true
  });

  // Cargar materias
  useEffect(() => {
    cargarMaterias();
  }, []);

  const cargarMaterias = async () => {
    try {
      const response = await apiService.getMaterias();
      setMaterias(response.data);
    } catch (error) {
      console.error('Error al cargar materias:', error);
    }
  };

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Crear o actualizar materia
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (materiaEdit) {
        // Actualizar
        await apiService.actualizarMateria(materiaEdit.id, formData);
        alert('Materia actualizada exitosamente');
      } else {
        // Crear
        await apiService.crearMateria(formData);
        alert('Materia creada exitosamente');
      }
      
      // Resetear formulario
      setFormData({
        codigo: '',
        nombre: '',
        descripcion: '',
        nivelDificultad: 'FACIL',
        activa: true
      });
      setMostrarForm(false);
      setMateriaEdit(null);
      cargarMaterias();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar la materia');
    }
  };

  // Editar materia
  const handleEditar = (materia) => {
    setMateriaEdit(materia);
    setFormData({
      codigo: materia.codigo,
      nombre: materia.nombre,
      descripcion: materia.descripcion,
      nivelDificultad: materia.nivelDificultad,
      activa: materia.activa
    });
    setMostrarForm(true);
  };

  // Eliminar materia
  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta materia?')) {
      try {
        await apiService.eliminarMateria(id);
        alert('Materia eliminada');
        cargarMaterias();
      } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar la materia');
      }
    }
  };

  return (
    <div className="gestion-container">
      <div className="gestion-header">
        <h1>Gestión de Materias</h1>
        <button 
          className="btn-crear"
          onClick={() => {
            setMostrarForm(!mostrarForm);
            setMateriaEdit(null);
            setFormData({
              codigo: '',
              nombre: '',
              descripcion: '',
              nivelDificultad: 'FACIL',
              activa: true
            });
          }}
        >
          {mostrarForm ? 'Cancelar' : '+ Nueva Materia'}
        </button>
      </div>

      {/* FORMULARIO */}
      {mostrarForm && (
        <div className="form-container">
          <h2>{materiaEdit ? 'Editar Materia' : 'Nueva Materia'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Código:</label>
              <input
                type="text"
                name="codigo"
                value={formData.codigo}
                onChange={handleChange}
                required
                placeholder="PROG101"
              />
            </div>

            <div className="form-group">
              <label>Nombre:</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                placeholder="Programación Básica"
              />
            </div>

            <div className="form-group">
              <label>Descripción:</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                required
                placeholder="Descripción de la materia"
                rows="4"
              />
            </div>

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

            <div className="form-group-checkbox">
              <label>
                <input
                  type="checkbox"
                  name="activa"
                  checked={formData.activa}
                  onChange={handleChange}
                />
                Materia Activa
              </label>
            </div>

            <button type="submit" className="btn-guardar">
              {materiaEdit ? 'Actualizar' : 'Crear'} Materia
            </button>
          </form>
        </div>
      )}

      {/* LISTA DE MATERIAS */}
      <div className="lista-container">
        <h2>Materias ({materias.length})</h2>
        <div className="tabla-responsive">
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Dificultad</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {materias.map((materia) => (
                <tr key={materia.id}>
                  <td>{materia.codigo}</td>
                  <td>{materia.nombre}</td>
                  <td>
                    <span className={`badge badge-${materia.nivelDificultad.toLowerCase()}`}>
                      {materia.nivelDificultad}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${materia.activa ? 'badge-activo' : 'badge-inactivo'}`}>
                      {materia.activa ? 'Activa' : 'Inactiva'}
                    </span>
                  </td>
                  <td className="acciones">
                    <button 
                      className="btn-editar"
                      onClick={() => handleEditar(materia)}
                    >
                      ✏️ Editar
                    </button>
                    <button 
                      className="btn-eliminar"
                      onClick={() => handleEliminar(materia.id)}
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

export default GestionMaterias;