// src/services/apiService.js

import axios from 'axios';
import authService from './authService';

const API_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api` 
  : 'http://localhost:8080/api';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado
      authService.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Servicios de API
 */
const apiService = {
  // ============================================
  // MATERIAS
  // ============================================
  getMaterias() {
    return api.get('/materias');
  },

  getMateriaById(id) {
    return api.get(`/materias/${id}`);
  },

  crearMateria(data) {
    return api.post('/materias', data);
  },

  actualizarMateria(id, data) {
    return api.put(`/materias/${id}`, data);
  },

  eliminarMateria(id) {
    return api.delete(`/materias/${id}`);
  },

  // ============================================
  // TEMAS
  // ============================================
  getTemas() {
    return api.get('/temas');
  },

  getTemasByMateria(materiaId) {
    return api.get(`/temas/materia/${materiaId}`);
  },

  crearTema(data) {
    return api.post('/temas', data);
  },

  actualizarTema(id, data) {
    return api.put(`/temas/${id}`, data);
  },

  eliminarTema(id) {
    return api.delete(`/temas/${id}`);
  },

  // ============================================
  // SUBTEMAS
  // ============================================
  getSubtemas() {
    return api.get('/subtemas');
  },

  getSubtemasByTema(temaId) {
    return api.get(`/subtemas/tema/${temaId}`);
  },

  crearSubtema(data) {
    return api.post('/subtemas', data);
  },

  actualizarSubtema(id, data) {
    return api.put(`/subtemas/${id}`, data);
  },

  eliminarSubtema(id) {
    return api.delete(`/subtemas/${id}`);
  },

  // ============================================
  // CONTENIDOS
  // ============================================
  getContenidos() {
    return api.get('/contenidos');
  },

  getContenidosBySubtema(subtemaId) {
    return api.get(`/contenidos/subtema/${subtemaId}`);
  },

  crearContenido(data) {
    return api.post('/contenidos', data);
  },

  actualizarContenido(id, data) {
    return api.put(`/contenidos/${id}`, data);
  },

  eliminarContenido(id) {
    return api.delete(`/contenidos/${id}`);
  },

  // ============================================
  // EJERCICIOS
  // ============================================
  getEjercicios() {
    return api.get('/ejercicios');
  },

  getEjerciciosBySubtema(subtemaId) {
    return api.get(`/ejercicios/subtema/${subtemaId}`);
  },

  getEjercicioById(id) {
    return api.get(`/ejercicios/${id}`);
  },

  crearEjercicio(data) {
    return api.post('/ejercicios', data);
  },

  actualizarEjercicio(id, data) {
    return api.put(`/ejercicios/${id}`, data);
  },

  eliminarEjercicio(id) {
    return api.delete(`/ejercicios/${id}`);
  },

  // ============================================
  // PREGUNTAS
  // ============================================
  getPreguntas() {
    return api.get('/preguntas');
  },

  getPreguntasBySubtema(subtemaId) {
    return api.get(`/preguntas/subtema/${subtemaId}`);
  },

  getPreguntasAleatorias(subtemaId, cantidad = 5) {
    return api.get(`/preguntas/subtema/${subtemaId}/aleatorias?cantidad=${cantidad}`);
  },

  verificarRespuesta(preguntaId, respuesta) {
    return api.post(`/preguntas/${preguntaId}/verificar`, { respuesta });
  },

  crearPregunta(data) {
    return api.post('/preguntas', data);
  },

  actualizarPregunta(id, data) {
    return api.put(`/preguntas/${id}`, data);
  },

  eliminarPregunta(id) {
    return api.delete(`/preguntas/${id}`);
  },

  // ============================================
  // RETROALIMENTACIONES
  // ============================================
  getRetroalimentaciones() {
    return api.get('/retroalimentaciones');
  },

  getRetroalimentacionesByUsuario(usuarioId) {
    return api.get(`/retroalimentaciones/usuario/${usuarioId}`);
  },

  getEstadisticasUsuario(usuarioId) {
    return api.get(`/retroalimentaciones/usuario/${usuarioId}/estadisticas`);
  },

  guardarRetroalimentacion(data) {
    return api.post('/retroalimentaciones', data);
  },

  // ============================================
  // USUARIOS
  // ============================================
  getUsuarios() {
    return api.get('/usuarios');
  },

  crearUsuario(data) {
    return api.post('/auth/register', data);
  },

  eliminarUsuario(id) {
    return api.delete(`/usuarios/${id}`);
  },

  // ============================================
  // PERFIL
  // ============================================
  getPerfil() {
    return api.get('/auth/me');
  },

  // ============================================
  // INTELIGENCIA ARTIFICIAL
  // ============================================
  generarPreguntasIA(subtemaId) {
    return api.post(`/ia/generar-preguntas/${subtemaId}`);
  },

  explicarContenidoIA(subtemaId) {
    return api.post(`/ia/explicar/${subtemaId}`);
  },

  generarEjemplosIA(subtemaId) {
    return api.post(`/ia/ejemplos/${subtemaId}`);
  },
};

export default apiService;