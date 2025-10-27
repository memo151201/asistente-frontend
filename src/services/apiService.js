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

  // ============================================
  // TEMAS
  // ============================================
  getTemas() {
    return api.get('/temas');
  },

  getTemasByMateria(materiaId) {
    return api.get(`/temas/materia/${materiaId}`);
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
  // PERFIL
  // ============================================
  getPerfil() {
    return api.get('/auth/me');
  }
};

export default apiService;