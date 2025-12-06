// src/pages/admin/GestionJerarquica.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/apiService';
import './GestionJerarquica.css';

const GestionJerarquica = () => {
  const navigate = useNavigate();
  const [materias, setMaterias] = useState([]);
  const [expandidos, setExpandidos] = useState({});
  const [editando, setEditando] = useState(null);
  const [cargando, setCargando] = useState(true);

  // ESTADO DE FORMULARIOS
  const [formMateria, setFormMateria] = useState({
    codigo: '', nombre: '', descripcion: '', nivelDificultad: 'FACIL', activa: true
  });

  const [formTema, setFormTema] = useState({
    nombre: '', descripcion: '', orden: 1, materiaId: null
  });

  const [formSubtema, setFormSubtema] = useState({
    nombre: '', descripcion: '', orden: 1, temaId: null
  });

  const [formContenido, setFormContenido] = useState({
    titulo: '', tipo: 'TEXTO', cuerpo: '', orden: 1, subtemaId: null
  });

  const [formEjercicio, setFormEjercicio] = useState({
    enunciado: '', 
    descripcion: '',
    tipo: 'CODIGO', 
    nivelDificultad: 'MEDIO', 
    solucionReferencia: '',
    subtemaId: null
  });

  // ============== CARGAR DATOS ==============
  useEffect(() => {
    cargarTodoJerarquico();
  }, []);

  const cargarTodoJerarquico = async () => {
    try {
      setCargando(true);
      const responseMaterias = await apiService.getMaterias();
      
      const materiasConDatos = await Promise.all(
        responseMaterias.data.map(async (materia) => {
          try {
            const temas = await apiService.getTemasByMateria(materia.id);
            
            const temasConSubtemas = await Promise.all(
              temas.data.map(async (tema) => {
                try {
                  const subtemas = await apiService.getSubtemasByTema(tema.id);
                  
                  const subtemasConDatos = await Promise.all(
                    subtemas.data.map(async (subtema) => {
                      try {
                        const [contenidos, ejercicios] = await Promise.all([
                          apiService.getContenidosBySubtema(subtema.id),
                          apiService.getEjerciciosBySubtema(subtema.id)
                        ]);
                        return { 
                          ...subtema, 
                          contenidos: contenidos.data || [], 
                          ejercicios: ejercicios.data || [] 
                        };
                      } catch (error) {
                        return { ...subtema, contenidos: [], ejercicios: [] };
                      }
                    })
                  );
                  
                  return { ...tema, subtemas: subtemasConDatos };
                } catch (error) {
                  return { ...tema, subtemas: [] };
                }
              })
            );
            
            return { ...materia, temas: temasConSubtemas };
          } catch (error) {
            return { ...materia, temas: [] };
          }
        })
      );
      
      setMaterias(materiasConDatos);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      alert('Error al cargar los datos');
    } finally {
      setCargando(false);
    }
  };

  // ============== TOGGLE EXPANSIÓN ==============
  const toggleExpansion = (tipo, id) => {
    const key = `${tipo}-${id}`;
    setExpandidos(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const isExpanded = (tipo, id) => expandidos[`${tipo}-${id}`] || false;

  // ============== CRUD MATERIAS ==============
  const crearMateria = async () => {
    if (!formMateria.codigo || !formMateria.nombre) {
      alert('Por favor completa los campos obligatorios');
      return;
    }
    try {
      await apiService.crearMateria(formMateria);
      alert('✅ Materia creada exitosamente');
      setFormMateria({ codigo: '', nombre: '', descripcion: '', nivelDificultad: 'FACIL', activa: true });
      setEditando(null);
      cargarTodoJerarquico();
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al crear la materia');
    }
  };

  const actualizarMateria = async (id, data) => {
    try {
      await apiService.actualizarMateria(id, data);
      alert('✅ Materia actualizada');
      setEditando(null);
      cargarTodoJerarquico();
    } catch (error) {
      alert('❌ Error al actualizar');
    }
  };

  const eliminarMateria = async (id) => {
    if (!window.confirm('¿Eliminar esta materia y todo su contenido?')) return;
    try {
      await apiService.eliminarMateria(id);
      alert('✅ Materia eliminada');
      cargarTodoJerarquico();
    } catch (error) {
      alert('❌ Error al eliminar');
    }
  };

  // ============== CRUD TEMAS ==============
  const crearTema = async (materiaId) => {
    if (!formTema.nombre) {
      alert('Por favor ingresa un nombre para el tema');
      return;
    }
    try {
      await apiService.crearTema({
        nombre: formTema.nombre,
        descripcion: formTema.descripcion,
        orden: parseInt(formTema.orden),
        materia: { id: parseInt(materiaId) }
      });
      alert('✅ Tema creado');
      setFormTema({ nombre: '', descripcion: '', orden: 1, materiaId: null });
      setEditando(null);
      cargarTodoJerarquico();
    } catch (error) {
      alert('❌ Error al crear el tema');
    }
  };

  const actualizarTema = async (id, data) => {
    try {
      await apiService.actualizarTema(id, data);
      alert('✅ Tema actualizado');
      setEditando(null);
      cargarTodoJerarquico();
    } catch (error) {
      alert('❌ Error al actualizar');
    }
  };

  const eliminarTema = async (id) => {
    if (!window.confirm('¿Eliminar este tema y sus subtemas?')) return;
    try {
      await apiService.eliminarTema(id);
      alert('✅ Tema eliminado');
      cargarTodoJerarquico();
    } catch (error) {
      alert('❌ Error al eliminar');
    }
  };

  // ============== CRUD SUBTEMAS ==============
  const crearSubtema = async (temaId) => {
    if (!formSubtema.nombre) {
      alert('Por favor ingresa un nombre para el subtema');
      return;
    }
    try {
      await apiService.crearSubtema({
        nombre: formSubtema.nombre,
        descripcion: formSubtema.descripcion,
        orden: parseInt(formSubtema.orden),
        tema: { id: parseInt(temaId) }
      });
      alert('✅ Subtema creado');
      setFormSubtema({ nombre: '', descripcion: '', orden: 1, temaId: null });
      setEditando(null);
      cargarTodoJerarquico();
    } catch (error) {
      alert('❌ Error al crear el subtema');
    }
  };

  const actualizarSubtema = async (id, data) => {
    try {
      await apiService.actualizarSubtema(id, data);
      alert('✅ Subtema actualizado');
      setEditando(null);
      cargarTodoJerarquico();
    } catch (error) {
      alert('❌ Error al actualizar');
    }
  };

  const eliminarSubtema = async (id) => {
    if (!window.confirm('¿Eliminar este subtema?')) return;
    try {
      await apiService.eliminarSubtema(id);
      alert('✅ Subtema eliminado');
      cargarTodoJerarquico();
    } catch (error) {
      alert('❌ Error al eliminar');
    }
  };

  // ============== CRUD CONTENIDOS ==============
  const crearContenido = async (subtemaId) => {
    if (!formContenido.titulo) {
      alert('Por favor ingresa un título');
      return;
    }
    try {
      await apiService.crearContenido({
        titulo: formContenido.titulo,
        tipo: formContenido.tipo,
        cuerpo: formContenido.cuerpo,
        orden: parseInt(formContenido.orden),
        subtema: { id: parseInt(subtemaId) }
      });
      alert('✅ Contenido creado');
      setFormContenido({ titulo: '', tipo: 'TEXTO', cuerpo: '', orden: 1, subtemaId: null });
      setEditando(null);
      cargarTodoJerarquico();
    } catch (error) {
      alert('❌ Error al crear contenido');
    }
  };

  const actualizarContenido = async (id, data) => {
    try {
      await apiService.actualizarContenido(id, data);
      alert('✅ Contenido actualizado');
      setEditando(null);
      cargarTodoJerarquico();
    } catch (error) {
      alert('❌ Error al actualizar');
    }
  };

  const eliminarContenido = async (id) => {
    if (!window.confirm('¿Eliminar este contenido?')) return;
    try {
      await apiService.eliminarContenido(id);
      alert('✅ Contenido eliminado');
      cargarTodoJerarquico();
    } catch (error) {
      alert('❌ Error al eliminar');
    }
  };

  // ============== CRUD EJERCICIOS ==============
  const crearEjercicio = async (subtemaId) => {
    if (!formEjercicio.enunciado) {
      alert('Por favor ingresa un enunciado');
      return;
    }
    try {
      await apiService.crearEjercicio({
        enunciado: formEjercicio.enunciado,
        descripcion: formEjercicio.descripcion,
        tipo: formEjercicio.tipo,
        nivelDificultad: formEjercicio.nivelDificultad,
        solucionReferencia: formEjercicio.solucionReferencia,
        subtema: { id: parseInt(subtemaId) }
      });
      alert('✅ Ejercicio creado');
      setFormEjercicio({ enunciado: '', descripcion: '', tipo: 'CODIGO', nivelDificultad: 'MEDIO', solucionReferencia: '', subtemaId: null });
      setEditando(null);
      cargarTodoJerarquico();
    } catch (error) {
      alert('❌ Error al crear ejercicio');
    }
  };

  const actualizarEjercicio = async (id, data) => {
    try {
      await apiService.actualizarEjercicio(id, data);
      alert('✅ Ejercicio actualizado');
      setEditando(null);
      cargarTodoJerarquico();
    } catch (error) {
      alert('❌ Error al actualizar');
    }
  };

  const eliminarEjercicio = async (id) => {
    if (!window.confirm('¿Eliminar este ejercicio?')) return;
    try {
      await apiService.eliminarEjercicio(id);
      alert('✅ Ejercicio eliminado');
      cargarTodoJerarquico();
    } catch (error) {
      alert('❌ Error al eliminar');
    }
  };

  // ============== RENDERIZADO ==============
  if (cargando) {
    return (
      <div className="gestion-jerarquica">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando estructura del curso...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="gestion-jerarquica">
      <div className="header-jerarquica">
        <div>
          <h1>📚 Gestión de Contenido Educativo</h1>
          <p>Administra materias, temas, subtemas, contenidos y ejercicios desde una sola vista</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-volver" onClick={() => navigate('/admin')}>
            ← Volver al Dashboard
          </button>
          <button className="btn-nueva-materia" onClick={() => setEditando({ tipo: 'nueva-materia' })}>
            ➕ Nueva Materia
          </button>
        </div>
      </div>

      {/* ==================== MODAL PARA CONTENIDO ==================== */}
      {(editando?.tipo === 'nuevo-contenido' || editando?.tipo === 'editar-contenido') && (
        <div className="modal-overlay" onClick={() => setEditando(null)}>
          <div className="modal-grande" onClick={(e) => e.stopPropagation()}>
            <div className="form-header">
              <h3>📝 {editando.tipo === 'nuevo-contenido' ? 'Nuevo Contenido' : 'Editar Contenido'}</h3>
              <button className="btn-close" onClick={() => setEditando(null)}>✖</button>
            </div>
            <div className="form-body-grande">
              <div className="form-group">
                <label>Título *</label>
                <input
                  type="text"
                  value={formContenido.titulo}
                  onChange={(e) => setFormContenido({ ...formContenido, titulo: e.target.value })}
                  placeholder="Título del contenido"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Tipo *</label>
                  <select
                    value={formContenido.tipo}
                    onChange={(e) => setFormContenido({ ...formContenido, tipo: e.target.value })}
                  >
                    <option value="TEXTO">Texto</option>
                    <option value="CODIGO">Código</option>
                    <option value="IMAGEN">Imagen</option>
                    <option value="VIDEO">Video</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Orden</label>
                  <input
                    type="number"
                    value={formContenido.orden}
                    onChange={(e) => setFormContenido({ ...formContenido, orden: e.target.value })}
                    min="1"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Contenido / Cuerpo *</label>
                <textarea
                  value={formContenido.cuerpo}
                  onChange={(e) => setFormContenido({ ...formContenido, cuerpo: e.target.value })}
                  placeholder="Escribe el contenido aquí..."
                  rows="12"
                  style={{ fontFamily: formContenido.tipo === 'CODIGO' ? 'monospace' : 'inherit' }}
                />
              </div>
              <div className="form-actions">
                <button className="btn-cancelar" onClick={() => setEditando(null)}>Cancelar</button>
                <button 
                  className="btn-guardar" 
                  onClick={() => editando.tipo === 'nuevo-contenido' 
                    ? crearContenido(editando.subtemaId) 
                    : actualizarContenido(editando.id, {
                        titulo: formContenido.titulo,
                        tipo: formContenido.tipo,
                        cuerpo: formContenido.cuerpo,
                        orden: parseInt(formContenido.orden),
                        subtema: { id: editando.subtemaId }
                      })
                  }
                >
                  {editando.tipo === 'nuevo-contenido' ? 'Crear' : 'Actualizar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL PARA EJERCICIO ==================== */}
      {(editando?.tipo === 'nuevo-ejercicio' || editando?.tipo === 'editar-ejercicio') && (
        <div className="modal-overlay" onClick={() => setEditando(null)}>
          <div className="modal-grande" onClick={(e) => e.stopPropagation()}>
            <div className="form-header">
              <h3>💪 {editando.tipo === 'nuevo-ejercicio' ? 'Nuevo Ejercicio' : 'Editar Ejercicio'}</h3>
              <button className="btn-close" onClick={() => setEditando(null)}>✖</button>
            </div>
            <div className="form-body-grande">
              <div className="form-group">
                <label>Enunciado *</label>
                <textarea
                  value={formEjercicio.enunciado}
                  onChange={(e) => setFormEjercicio({ ...formEjercicio, enunciado: e.target.value })}
                  placeholder="Escribe el enunciado del ejercicio..."
                  rows="4"
                />
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  value={formEjercicio.descripcion}
                  onChange={(e) => setFormEjercicio({ ...formEjercicio, descripcion: e.target.value })}
                  placeholder="Descripción adicional o contexto del ejercicio (opcional)"
                  rows="3"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Tipo *</label>
                  <select
                    value={formEjercicio.tipo}
                    onChange={(e) => setFormEjercicio({ ...formEjercicio, tipo: e.target.value })}
                  >
                    <option value="CODIGO">Código</option>
                    <option value="PROBLEMA">Problema</option>
                    <option value="TEXTO_LIBRE">Texto Libre</option>
                    <option value="ANALISIS">Análisis</option>
                    <option value="SQL">SQL</option>
                    <option value="PRACTICA">Práctica</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Dificultad *</label>
                  <select
                    value={formEjercicio.nivelDificultad}
                    onChange={(e) => setFormEjercicio({ ...formEjercicio, nivelDificultad: e.target.value })}
                  >
                    <option value="FACIL">Fácil</option>
                    <option value="MEDIO">Medio</option>
                    <option value="DIFICIL">Difícil</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Solución de Referencia</label>
                <textarea
                  value={formEjercicio.solucionReferencia}
                  onChange={(e) => setFormEjercicio({ ...formEjercicio, solucionReferencia: e.target.value })}
                  placeholder="# Solución de ejemplo o guía de referencia (opcional)"
                  rows="8"
                  style={{ fontFamily: 'monospace' }}
                />
              </div>
              <div className="form-actions">
                <button className="btn-cancelar" onClick={() => setEditando(null)}>Cancelar</button>
                <button 
                  className="btn-guardar" 
                  onClick={() => editando.tipo === 'nuevo-ejercicio' 
                    ? crearEjercicio(editando.subtemaId) 
                    : actualizarEjercicio(editando.id, {
                        enunciado: formEjercicio.enunciado,
                        descripcion: formEjercicio.descripcion,
                        tipo: formEjercicio.tipo,
                        nivelDificultad: formEjercicio.nivelDificultad,
                        solucionReferencia: formEjercicio.solucionReferencia,
                        subtema: { id: editando.subtemaId }
                      })
                  }
                >
                  {editando.tipo === 'nuevo-ejercicio' ? 'Crear' : 'Actualizar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FORMULARIO NUEVA MATERIA */}
      {editando?.tipo === 'nueva-materia' && (
        <div className="form-card form-materia">
          <div className="form-header">
            <h3>📖 Nueva Materia</h3>
            <button className="btn-close" onClick={() => setEditando(null)}>✖</button>
          </div>
          <div className="form-body">
            <div className="form-row">
              <div className="form-group">
                <label>Código *</label>
                <input type="text" placeholder="PROG101" value={formMateria.codigo} onChange={(e) => setFormMateria({ ...formMateria, codigo: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Nombre *</label>
                <input type="text" placeholder="Programación Básica" value={formMateria.nombre} onChange={(e) => setFormMateria({ ...formMateria, nombre: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label>Descripción *</label>
              <textarea placeholder="Descripción de la materia" rows="3" value={formMateria.descripcion} onChange={(e) => setFormMateria({ ...formMateria, descripcion: e.target.value })} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Nivel de Dificultad</label>
                <select value={formMateria.nivelDificultad} onChange={(e) => setFormMateria({ ...formMateria, nivelDificultad: e.target.value })}>
                  <option value="FACIL">Fácil</option>
                  <option value="MEDIO">Medio</option>
                  <option value="DIFICIL">Difícil</option>
                </select>
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input type="checkbox" checked={formMateria.activa} onChange={(e) => setFormMateria({ ...formMateria, activa: e.target.checked })} />
                  Materia Activa
                </label>
              </div>
            </div>
            <div className="form-actions">
              <button className="btn-cancelar" onClick={() => setEditando(null)}>Cancelar</button>
              <button className="btn-guardar" onClick={crearMateria}>Crear Materia</button>
            </div>
          </div>
        </div>
      )}

      {/* ÁRBOL DE MATERIAS */}
      <div className="arbol-container">
        {materias.length === 0 ? (
          <div className="empty-state">
            <p>📭 No hay materias creadas aún</p>
            <button className="btn-crear-primera" onClick={() => setEditando({ tipo: 'nueva-materia' })}>Crear primera materia</button>
          </div>
        ) : (
          materias.map((materia) => (
            <div key={materia.id} className="nodo-materia">
              {/* MATERIA */}
              <div className="item-header materia-header">
                <div className="item-info">
                  <button className="btn-expand" onClick={() => toggleExpansion('materia', materia.id)}>
                    {isExpanded('materia', materia.id) ? '▼' : '▶'}
                  </button>
                  <span className="icono">📚</span>
                  <div className="item-content">
                    <h3>{materia.nombre}</h3>
                    <p className="item-meta">
                      <span className="codigo">{materia.codigo}</span>
                      <span className={`badge badge-${materia.nivelDificultad.toLowerCase()}`}>{materia.nivelDificultad}</span>
                      <span className="contador">{materia.temas?.length || 0} temas</span>
                    </p>
                  </div>
                </div>
                <div className="item-actions">
                  <button className="btn-action btn-add" onClick={() => { setFormTema({ nombre: '', descripcion: '', orden: 1, materiaId: materia.id }); setEditando({ tipo: 'nuevo-tema', materiaId: materia.id }); }}>➕ Tema</button>
                  <button className="btn-action btn-edit" onClick={() => { setFormMateria({ codigo: materia.codigo, nombre: materia.nombre, descripcion: materia.descripcion, nivelDificultad: materia.nivelDificultad, activa: materia.activa }); setEditando({ tipo: 'editar-materia', id: materia.id }); }}>✏️</button>
                  <button className="btn-action btn-delete" onClick={() => eliminarMateria(materia.id)}>🗑️</button>
                </div>
              </div>

              {/* FORMULARIO EDITAR MATERIA */}
              {editando?.tipo === 'editar-materia' && editando?.id === materia.id && (
                <div className="form-inline">
                  <div className="form-row">
                    <input type="text" value={formMateria.codigo} onChange={(e) => setFormMateria({ ...formMateria, codigo: e.target.value })} placeholder="Código" />
                    <input type="text" value={formMateria.nombre} onChange={(e) => setFormMateria({ ...formMateria, nombre: e.target.value })} placeholder="Nombre" />
                    <select value={formMateria.nivelDificultad} onChange={(e) => setFormMateria({ ...formMateria, nivelDificultad: e.target.value })}>
                      <option value="FACIL">Fácil</option>
                      <option value="MEDIO">Medio</option>
                      <option value="DIFICIL">Difícil</option>
                    </select>
                  </div>
                  <div className="form-actions-inline">
                    <button className="btn-cancelar-inline" onClick={() => setEditando(null)}>✖</button>
                    <button className="btn-guardar-inline" onClick={() => actualizarMateria(materia.id, formMateria)}>✓</button>
                  </div>
                </div>
              )}

              {/* FORMULARIO NUEVO TEMA */}
              {editando?.tipo === 'nuevo-tema' && editando?.materiaId === materia.id && (
                <div className="form-inline form-tema">
                  <div className="form-row">
                    <input type="text" value={formTema.nombre} onChange={(e) => setFormTema({ ...formTema, nombre: e.target.value })} placeholder="Nombre del tema" />
                    <input type="text" value={formTema.descripcion} onChange={(e) => setFormTema({ ...formTema, descripcion: e.target.value })} placeholder="Descripción" />
                    <input type="number" value={formTema.orden} onChange={(e) => setFormTema({ ...formTema, orden: e.target.value })} placeholder="Orden" min="1" style={{ width: '80px' }} />
                  </div>
                  <div className="form-actions-inline">
                    <button className="btn-cancelar-inline" onClick={() => setEditando(null)}>✖</button>
                    <button className="btn-guardar-inline" onClick={() => crearTema(materia.id)}>✓ Crear</button>
                  </div>
                </div>
              )}

              {/* TEMAS */}
              {isExpanded('materia', materia.id) && (
                <div className="nodo-hijos">
                  {materia.temas?.map((tema) => (
                    <div key={tema.id} className="nodo-tema">
                      <div className="item-header tema-header">
                        <div className="item-info">
                          <button className="btn-expand" onClick={() => toggleExpansion('tema', tema.id)}>
                            {isExpanded('tema', tema.id) ? '▼' : '▶'}
                          </button>
                          <span className="icono">📘</span>
                          <div className="item-content">
                            <h4>{tema.nombre}</h4>
                            <p className="item-meta">
                              <span className="orden">Orden: {tema.orden}</span>
                              <span className="contador">{tema.subtemas?.length || 0} subtemas</span>
                            </p>
                          </div>
                        </div>
                        <div className="item-actions">
                          <button className="btn-action btn-add" onClick={() => { setFormSubtema({ nombre: '', descripcion: '', orden: 1, temaId: tema.id }); setEditando({ tipo: 'nuevo-subtema', temaId: tema.id }); }}>➕ Subtema</button>
                          <button className="btn-action btn-edit" onClick={() => { setFormTema({ nombre: tema.nombre, descripcion: tema.descripcion, orden: tema.orden, materiaId: materia.id }); setEditando({ tipo: 'editar-tema', id: tema.id }); }}>✏️</button>
                          <button className="btn-action btn-delete" onClick={() => eliminarTema(tema.id)}>🗑️</button>
                        </div>
                      </div>

                      {/* FORMULARIO EDITAR TEMA */}
                      {editando?.tipo === 'editar-tema' && editando?.id === tema.id && (
                        <div className="form-inline">
                          <div className="form-row">
                            <input type="text" value={formTema.nombre} onChange={(e) => setFormTema({ ...formTema, nombre: e.target.value })} placeholder="Nombre" />
                            <input type="text" value={formTema.descripcion} onChange={(e) => setFormTema({ ...formTema, descripcion: e.target.value })} placeholder="Descripción" />
                            <input type="number" value={formTema.orden} onChange={(e) => setFormTema({ ...formTema, orden: e.target.value })} min="1" style={{ width: '80px' }} />
                          </div>
                          <div className="form-actions-inline">
                            <button className="btn-cancelar-inline" onClick={() => setEditando(null)}>✖</button>
                            <button className="btn-guardar-inline" onClick={() => actualizarTema(tema.id, { nombre: formTema.nombre, descripcion: formTema.descripcion, orden: parseInt(formTema.orden), materia: { id: materia.id } })}>✓</button>
                          </div>
                        </div>
                      )}

                      {/* FORMULARIO NUEVO SUBTEMA */}
                      {editando?.tipo === 'nuevo-subtema' && editando?.temaId === tema.id && (
                        <div className="form-inline form-subtema">
                          <div className="form-row">
                            <input type="text" value={formSubtema.nombre} onChange={(e) => setFormSubtema({ ...formSubtema, nombre: e.target.value })} placeholder="Nombre del subtema" />
                            <input type="text" value={formSubtema.descripcion} onChange={(e) => setFormSubtema({ ...formSubtema, descripcion: e.target.value })} placeholder="Descripción" />
                            <input type="number" value={formSubtema.orden} onChange={(e) => setFormSubtema({ ...formSubtema, orden: e.target.value })} placeholder="Orden" min="1" style={{ width: '80px' }} />
                          </div>
                          <div className="form-actions-inline">
                            <button className="btn-cancelar-inline" onClick={() => setEditando(null)}>✖</button>
                            <button className="btn-guardar-inline" onClick={() => crearSubtema(tema.id)}>✓ Crear</button>
                          </div>
                        </div>
                      )}

                      {/* SUBTEMAS */}
                      {isExpanded('tema', tema.id) && (
                        <div className="nodo-hijos">
                          {tema.subtemas?.map((subtema) => (
                            <div key={subtema.id} className="nodo-subtema">
                              <div className="item-header subtema-header">
                                <div className="item-info">
                                  <button className="btn-expand" onClick={() => toggleExpansion('subtema', subtema.id)}>
                                    {isExpanded('subtema', subtema.id) ? '▼' : '▶'}
                                  </button>
                                  <span className="icono">📄</span>
                                  <div className="item-content">
                                    <h5>{subtema.nombre}</h5>
                                    <p className="item-meta">
                                      <span className="orden">Orden: {subtema.orden}</span>
                                      <span className="contador">{subtema.contenidos?.length || 0} contenidos</span>
                                      <span className="contador">{subtema.ejercicios?.length || 0} ejercicios</span>
                                    </p>
                                  </div>
                                </div>
                                <div className="item-actions">
                                  <button className="btn-action btn-add" onClick={() => { setFormContenido({ titulo: '', tipo: 'TEXTO', cuerpo: '', orden: 1, subtemaId: subtema.id }); setEditando({ tipo: 'nuevo-contenido', subtemaId: subtema.id }); }}>➕ Contenido</button>
                                  <button className="btn-action btn-add" onClick={() => { setFormEjercicio({ enunciado: '', descripcion: '', tipo: 'CODIGO', nivelDificultad: 'MEDIO', solucionReferencia: '', subtemaId: subtema.id }); setEditando({ tipo: 'nuevo-ejercicio', subtemaId: subtema.id }); }}>➕ Ejercicio</button>
                                  <button className="btn-action btn-edit" onClick={() => { setFormSubtema({ nombre: subtema.nombre, descripcion: subtema.descripcion, orden: subtema.orden, temaId: tema.id }); setEditando({ tipo: 'editar-subtema', id: subtema.id }); }}>✏️</button>
                                  <button className="btn-action btn-delete" onClick={() => eliminarSubtema(subtema.id)}>🗑️</button>
                                </div>
                              </div>

                              {/* FORMULARIO EDITAR SUBTEMA */}
                              {editando?.tipo === 'editar-subtema' && editando?.id === subtema.id && (
                                <div className="form-inline">
                                  <div className="form-row">
                                    <input type="text" value={formSubtema.nombre} onChange={(e) => setFormSubtema({ ...formSubtema, nombre: e.target.value })} placeholder="Nombre" />
                                    <input type="text" value={formSubtema.descripcion} onChange={(e) => setFormSubtema({ ...formSubtema, descripcion: e.target.value })} placeholder="Descripción" />
                                    <input type="number" value={formSubtema.orden} onChange={(e) => setFormSubtema({ ...formSubtema, orden: e.target.value })} min="1" style={{ width: '80px' }} />
                                  </div>
                                  <div className="form-actions-inline">
                                    <button className="btn-cancelar-inline" onClick={() => setEditando(null)}>✖</button>
                                    <button className="btn-guardar-inline" onClick={() => actualizarSubtema(subtema.id, { nombre: formSubtema.nombre, descripcion: formSubtema.descripcion, orden: parseInt(formSubtema.orden), tema: { id: tema.id } })}>✓</button>
                                  </div>
                                </div>
                              )}

                              {/* CONTENIDOS Y EJERCICIOS */}
                              {isExpanded('subtema', subtema.id) && (
                                <div className="nodo-hijos-final">
                                  {/* CONTENIDOS */}
                                  <div className="seccion-contenidos">
                                    <h6>📝 Contenidos ({subtema.contenidos?.length || 0})</h6>
                                    {subtema.contenidos?.map((contenido) => (
                                      <div key={contenido.id} className="item-final">
                                        <div className="item-final-info">
                                          <span className={`badge badge-tipo-${contenido.tipo.toLowerCase()}`}>{contenido.tipo}</span>
                                          <span>{contenido.titulo}</span>
                                          <span className="orden-pequeño">Orden: {contenido.orden}</span>
                                        </div>
                                        <div className="item-final-actions">
                                          <button className="btn-mini btn-edit" onClick={() => { 
                                            setFormContenido({ titulo: contenido.titulo, tipo: contenido.tipo, cuerpo: contenido.cuerpo, orden: contenido.orden, subtemaId: subtema.id }); 
                                            setEditando({ tipo: 'editar-contenido', id: contenido.id, subtemaId: subtema.id }); 
                                          }}>✏️</button>
                                          <button className="btn-mini btn-delete" onClick={() => eliminarContenido(contenido.id)}>🗑️</button>
                                        </div>
                                      </div>
                                    ))}
                                    {(!subtema.contenidos || subtema.contenidos.length === 0) && <p className="empty-text">No hay contenidos</p>}
                                  </div>

                                  {/* EJERCICIOS */}
                                  <div className="seccion-ejercicios">
                                    <h6>💪 Ejercicios ({subtema.ejercicios?.length || 0})</h6>
                                    {subtema.ejercicios?.map((ejercicio) => (
                                      <div key={ejercicio.id} className="item-final">
                                        <div className="item-final-info">
                                          <span className={`badge badge-${ejercicio.nivelDificultad.toLowerCase()}`}>{ejercicio.nivelDificultad}</span>
                                          <span className={`badge badge-tipo-${ejercicio.tipo.toLowerCase()}`}>{ejercicio.tipo}</span>
                                          <span>{ejercicio.enunciado.substring(0, 50)}...</span>
                                        </div>
                                        <div className="item-final-actions">
                                          <button className="btn-mini btn-edit" onClick={() => { 
                                            setFormEjercicio({ enunciado: ejercicio.enunciado, descripcion: ejercicio.descripcion, tipo: ejercicio.tipo, nivelDificultad: ejercicio.nivelDificultad, solucionReferencia: ejercicio.solucionReferencia, subtemaId: subtema.id }); 
                                            setEditando({ tipo: 'editar-ejercicio', id: ejercicio.id, subtemaId: subtema.id }); 
                                          }}>✏️</button>
                                          <button className="btn-mini btn-delete" onClick={() => eliminarEjercicio(ejercicio.id)}>🗑️</button>
                                        </div>
                                      </div>
                                    ))}
                                    {(!subtema.ejercicios || subtema.ejercicios.length === 0) && <p className="empty-text">No hay ejercicios</p>}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                          {tema.subtemas?.length === 0 && !editando && <div className="empty-node"><p>No hay subtemas aún</p></div>}
                        </div>
                      )}
                    </div>
                  ))}
                  {materia.temas?.length === 0 && !editando && <div className="empty-node"><p>No hay temas aún</p></div>}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GestionJerarquica;