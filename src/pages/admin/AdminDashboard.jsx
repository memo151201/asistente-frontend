// src/pages/admin/AdminDashboard.jsx

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiService from '../../services/apiService';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [estadisticas, setEstadisticas] = useState({
    totalMaterias: 0,
    totalTemas: 0,
    totalSubtemas: 0,
    totalContenidos: 0,
    totalEjercicios: 0,
    totalPreguntas: 0,
    totalUsuarios: 0
  });

  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    setCargando(true);
    try {
      const [materias, temas, subtemas, contenidos, ejercicios, preguntas, usuarios] = await Promise.all([
        apiService.getMaterias(),
        apiService.getTemas(),
        apiService.getSubtemas(),
        apiService.getContenidos(),
        apiService.getEjercicios(),
        apiService.getPreguntas(),
        apiService.getUsuarios()
      ]);

      setEstadisticas({
        totalMaterias: materias.data.length,
        totalTemas: temas.data.length,
        totalSubtemas: subtemas.data.length,
        totalContenidos: contenidos.data.length,
        totalEjercicios: ejercicios.data.length,
        totalPreguntas: preguntas.data.length,
        totalUsuarios: usuarios.data.length
      });
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setCargando(false);
    }
  };

  // Colores para los gráficos
  const COLORES = ['#4A90E2', '#7B68EE', '#50C878', '#FF6B6B', '#FFA500', '#FF1493', '#20B2AA'];

  // Datos para gráfico de barras
  const datosBarras = [
    { nombre: 'Materias', cantidad: estadisticas.totalMaterias, color: '#4A90E2' },
    { nombre: 'Temas', cantidad: estadisticas.totalTemas, color: '#7B68EE' },
    { nombre: 'Subtemas', cantidad: estadisticas.totalSubtemas, color: '#50C878' },
    { nombre: 'Contenidos', cantidad: estadisticas.totalContenidos, color: '#FF6B6B' },
  ];

  // Datos para gráfico circular
  const datosPie = [
    { nombre: 'Contenidos', valor: estadisticas.totalContenidos },
    { nombre: 'Ejercicios', valor: estadisticas.totalEjercicios },
    { nombre: 'Preguntas', valor: estadisticas.totalPreguntas },
  ];

  // Datos para gráfico de área
  const datosArea = [
    { categoria: 'Educativo', items: estadisticas.totalMaterias + estadisticas.totalTemas + estadisticas.totalSubtemas },
    { categoria: 'Contenido', items: estadisticas.totalContenidos },
    { categoria: 'Evaluación', items: estadisticas.totalEjercicios + estadisticas.totalPreguntas },
  ];

  const tarjetas = [
    {
      titulo: 'Materias',
      cantidad: estadisticas.totalMaterias,
      icono: '📚',
      color: '#4A90E2',
      ruta: '/admin/jerarquia', // ✅ CAMBIADO
      gradiente: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      titulo: 'Temas',
      cantidad: estadisticas.totalTemas,
      icono: '📖',
      color: '#7B68EE',
      ruta: '/admin/jerarquia', // ✅ CAMBIADO
      gradiente: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      titulo: 'Subtemas',
      cantidad: estadisticas.totalSubtemas,
      icono: '📝',
      color: '#50C878',
      ruta: '/admin/jerarquia', // ✅ CAMBIADO
      gradiente: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      titulo: 'Contenidos',
      cantidad: estadisticas.totalContenidos,
      icono: '📄',
      color: '#FF6B6B',
      ruta: '/admin/contenidos',
      gradiente: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    },
    {
      titulo: 'Ejercicios',
      cantidad: estadisticas.totalEjercicios,
      icono: '💪',
      color: '#FFA500',
      ruta: '/admin/ejercicios',
      gradiente: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    },
    {
      titulo: 'Preguntas',
      cantidad: estadisticas.totalPreguntas,
      icono: '❓',
      color: '#FF1493',
      ruta: '/admin/preguntas',
      gradiente: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)'
    },
    {
      titulo: 'Usuarios',
      cantidad: estadisticas.totalUsuarios,
      icono: '👥',
      color: '#20B2AA',
      ruta: '/admin/usuarios',
      gradiente: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
    }
  ];

  if (cargando) {
    return (
      <div className="dashboard-container">
        <div className="loading-estado">
          <div className="spinner"></div>
          <p>Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  const totalItems = estadisticas.totalMaterias + estadisticas.totalTemas + 
                     estadisticas.totalSubtemas + estadisticas.totalContenidos +
                     estadisticas.totalEjercicios + estadisticas.totalPreguntas;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>📊 Panel de Administración</h1>
        <p className="dashboard-subtitle">Vista general del sistema de aprendizaje</p>
        
        {/* ✅ BOTÓN NUEVO - GESTIÓN JERÁRQUICA */}
        <button 
          className="btn-gestion-jerarquica"
          onClick={() => navigate('/admin/jerarquia')}
        >
          🌳 Gestión Jerárquica
        </button>
      </div>

      {/* TARJETAS DE ESTADÍSTICAS */}
      <div className="estadisticas-grid">
        {tarjetas.map((tarjeta, index) => (
          <Link 
            to={tarjeta.ruta} 
            key={index} 
            className="tarjeta-estadistica"
            style={{ '--tarjeta-color': tarjeta.color }}
          >
            <div className="tarjeta-fondo" style={{ background: tarjeta.gradiente }}></div>
            <div className="tarjeta-contenido">
              <div className="tarjeta-icono">{tarjeta.icono}</div>
              <div className="tarjeta-info">
                <h3>{tarjeta.titulo}</h3>
                <p className="tarjeta-cantidad">{tarjeta.cantidad}</p>
              </div>
              <div className="tarjeta-flecha">→</div>
            </div>
          </Link>
        ))}
      </div>

      {/* ESTADÍSTICAS RÁPIDAS */}
      <div className="stats-rapidas">
        <div className="stat-card">
          <div className="stat-numero">{totalItems}</div>
          <div className="stat-label">Total de Items</div>
        </div>
        <div className="stat-card">
          <div className="stat-numero">{estadisticas.totalContenidos + estadisticas.totalEjercicios}</div>
          <div className="stat-label">Material Educativo</div>
        </div>
        <div className="stat-card">
          <div className="stat-numero">{estadisticas.totalEjercicios + estadisticas.totalPreguntas}</div>
          <div className="stat-label">Evaluaciones</div>
        </div>
        <div className="stat-card">
          <div className="stat-numero">{estadisticas.totalUsuarios}</div>
          <div className="stat-label">Usuarios Activos</div>
        </div>
      </div>

      {/* GRÁFICOS */}
      <div className="graficos-section">
        <h2>📈 Análisis Visual</h2>
        
        <div className="graficos-grid">
          {/* GRÁFICO DE BARRAS */}
          <div className="grafico-card">
            <h3>Estructura del Contenido</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={datosBarras}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="nombre" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar dataKey="cantidad" radius={[8, 8, 0, 0]}>
                  {datosBarras.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* GRÁFICO CIRCULAR */}
          <div className="grafico-card">
            <h3>Distribución de Recursos</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={datosPie}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ nombre, valor }) => `${nombre}: ${valor}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="valor"
                >
                  {datosPie.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORES[index + 3]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* GRÁFICO DE ÁREA */}
          <div className="grafico-card grafico-full">
            <h3>Resumen por Categoría</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={datosArea}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="categoria" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="items" 
                  stroke="#4A90E2" 
                  fill="url(#colorGradient)" 
                  strokeWidth={3}
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4A90E2" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#4A90E2" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

       
     
    </div>
  );
};

export default AdminDashboard;