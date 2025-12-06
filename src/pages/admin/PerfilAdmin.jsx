// src/pages/admin/PerfilAdmin.jsx

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import apiService from '../../services/apiService';
import './PerfilAdmin.css';

const PerfilAdmin = () => {
  const { user } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    cargo: ''
  });

  // ✅ NUEVO: Estado para estadísticas
  const [estadisticas, setEstadisticas] = useState({
    totalMaterias: 0,
    totalTemas: 0,
    totalUsuarios: 0,
    totalEjercicios: 0
  });

  const [cargandoStats, setCargandoStats] = useState(true);

  useEffect(() => {
    if (user) {
      setProfileData({
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        email: user.email || '',
        telefono: user.telefono || '',
        cargo: 'Administrador del Sistema'
      });
    }
    
    // ✅ NUEVO: Cargar estadísticas
    cargarEstadisticas();
  }, [user]);

  // ✅ NUEVO: Función para cargar estadísticas
  const cargarEstadisticas = async () => {
    setCargandoStats(true);
    try {
      const [materias, temas, usuarios, ejercicios] = await Promise.all([
        apiService.getMaterias(),
        apiService.getTemas(),
        apiService.getUsuarios(),
        apiService.getEjercicios()
      ]);

      setEstadisticas({
        totalMaterias: materias.data?.length || 0,
        totalTemas: temas.data?.length || 0,
        totalUsuarios: usuarios.data?.length || 0,
        totalEjercicios: ejercicios.data?.length || 0
      });
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setCargandoStats(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = () => {
    // Aquí iría la lógica para guardar los cambios
    console.log('Guardando cambios:', profileData);
    setEditMode(false);
    // TODO: Implementar llamada a API para actualizar perfil
  };

  const handleCancelEdit = () => {
    // Restaurar datos originales
    setProfileData({
      nombre: user.nombre || '',
      apellido: user.apellido || '',
      email: user.email || '',
      telefono: user.telefono || '',
      cargo: 'Administrador del Sistema'
    });
    setEditMode(false);
  };

  return (
    <div className="perfil-admin-container">
      <div className="perfil-header">
        <h1>👤 Mi Perfil de Administrador</h1>
        <p className="perfil-subtitle">Gestiona tu información personal</p>
      </div>

      <div className="perfil-content">
        {/* Card Principal */}
        <div className="perfil-card">
          <div className="perfil-card-header">
            <div className="perfil-avatar">
              <span className="avatar-icon">👨‍💼</span>
            </div>
            <div className="perfil-info-header">
              <h2>{profileData.nombre} {profileData.apellido}</h2>
              <span className="perfil-badge">
                {user?.rol || 'ADMINISTRADOR'}
              </span>
            </div>
            {!editMode && (
              <button 
                className="btn-edit-profile"
                onClick={() => setEditMode(true)}
              >
                ✏️ Editar Perfil
              </button>
            )}
          </div>

          <div className="perfil-card-body">
            <div className="perfil-form">
              {/* Nombre */}
              <div className="form-group">
                <label>
                  <span className="label-icon">👤</span>
                  Nombre
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={profileData.nombre}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  className={editMode ? 'editable' : ''}
                />
              </div>

              {/* Apellido */}
              <div className="form-group">
                <label>
                  <span className="label-icon">👤</span>
                  Apellido
                </label>
                <input
                  type="text"
                  name="apellido"
                  value={profileData.apellido}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  className={editMode ? 'editable' : ''}
                />
              </div>

              {/* Email */}
              <div className="form-group">
                <label>
                  <span className="label-icon">📧</span>
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  className={editMode ? 'editable' : ''}
                />
              </div>

              {/* Teléfono */}
              <div className="form-group">
                <label>
                  <span className="label-icon">📱</span>
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={profileData.telefono}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  className={editMode ? 'editable' : ''}
                  placeholder="Ej: +52 961 123 4567"
                />
              </div>

              {/* Cargo */}
              <div className="form-group">
                <label>
                  <span className="label-icon">💼</span>
                  Cargo
                </label>
                <input
                  type="text"
                  name="cargo"
                  value={profileData.cargo}
                  disabled
                  className="disabled-field"
                />
              </div>
            </div>

            {/* Botones de Acción */}
            {editMode && (
              <div className="perfil-actions">
                <button 
                  className="btn-save"
                  onClick={handleSaveChanges}
                >
                  💾 Guardar Cambios
                </button>
                <button 
                  className="btn-cancel"
                  onClick={handleCancelEdit}
                >
                  ❌ Cancelar
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Card de Estadísticas - ✅ ACTUALIZADO */}
        <div className="perfil-stats-card">
          <h3>📊 Estadísticas del Sistema</h3>
          
          {cargandoStats ? (
            <div className="stats-loading">
              <div className="spinner-small"></div>
              <p>Cargando...</p>
            </div>
          ) : (
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-icon">📚</div>
                <div className="stat-info">
                  <span className="stat-value">{estadisticas.totalMaterias}</span>
                  <span className="stat-label">Materias Creadas</span>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">📝</div>
                <div className="stat-info">
                  <span className="stat-value">{estadisticas.totalTemas}</span>
                  <span className="stat-label">Temas Creados</span>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <span className="stat-value">{estadisticas.totalUsuarios}</span>
                  <span className="stat-label">Usuarios Activos</span>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">✅</div>
                <div className="stat-info">
                  <span className="stat-value">{estadisticas.totalEjercicios}</span>
                  <span className="stat-label">Ejercicios Creados</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Card de Acceso Rápido */}
        <div className="perfil-quick-access">
          <h3>⚡ Acceso Rápido</h3>
          <div className="quick-links">
            <a href="/admin" className="quick-link">
              <span className="quick-icon">🏠</span>
              <span>Dashboard</span>
            </a>
            <a href="/admin/jerarquia" className="quick-link">
              <span className="quick-icon">🌳</span>
              <span>Gestión Jerárquica</span>
            </a>
            <a href="/admin/contenidos" className="quick-link">
              <span className="quick-icon">📄</span>
              <span>Contenidos</span>
            </a>
            <a href="/admin/usuarios" className="quick-link">
              <span className="quick-icon">👥</span>
              <span>Usuarios</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilAdmin;