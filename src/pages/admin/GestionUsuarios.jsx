// src/pages/admin/GestionUsuarios.jsx

import { useState, useEffect } from 'react';
import apiService from '../../services/apiService';
import './Admin.css';

const GestionUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    rol: 'ESTUDIANTE'
  });

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const response = await apiService.getUsuarios();
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
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

    try {
      await apiService.crearUsuario(formData);
      alert('Usuario creado exitosamente');
      
      setFormData({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        rol: 'ESTUDIANTE'
      });
      setMostrarForm(false);
      cargarUsuarios();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al crear el usuario');
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      try {
        await apiService.eliminarUsuario(id);
        alert('Usuario eliminado');
        cargarUsuarios();
      } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar el usuario');
      }
    }
  };

  return (
    <div className="gestion-container">
      <div className="gestion-header">
        <h1>Gestión de Usuarios</h1>
        <button 
          className="btn-crear"
          onClick={() => {
            setMostrarForm(!mostrarForm);
            setFormData({
              nombre: '',
              apellido: '',
              email: '',
              password: '',
              rol: 'ESTUDIANTE'
            });
          }}
        >
          {mostrarForm ? 'Cancelar' : '+ Nuevo Usuario'}
        </button>
      </div>

      {mostrarForm && (
        <div className="form-container">
          <h2>Nuevo Usuario</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nombre:</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Apellido:</label>
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Contraseña:</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
              />
            </div>

            <div className="form-group">
              <label>Rol:</label>
              <select
                name="rol"
                value={formData.rol}
                onChange={handleChange}
                required
              >
                <option value="ESTUDIANTE">Estudiante</option>
                <option value="ADMINISTRADOR">Administrador</option>
              </select>
            </div>

            <button type="submit" className="btn-guardar">
              Crear Usuario
            </button>
          </form>
        </div>
      )}

      <div className="lista-container">
        <h2>Usuarios ({usuarios.length})</h2>
        <div className="tabla-responsive">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.nombre} {usuario.apellido}</td>
                  <td>{usuario.email}</td>
                  <td>
                    <span className={`badge ${usuario.rol === 'ADMINISTRADOR' ? 'badge-admin' : 'badge-estudiante'}`}>
                      {usuario.rol}
                    </span>
                  </td>
                  <td className="acciones">
                    <button 
                      className="btn-eliminar"
                      onClick={() => handleEliminar(usuario.id)}
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

export default GestionUsuarios;