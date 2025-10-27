// src/services/authService.js

const API_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api/auth` 
  : 'http://localhost:8080/api/auth';
/**
 * Servicio de autenticación
 */
const authService = {
  /**
   * Registrar nuevo usuario
   */
  async register(userData) {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.mensaje || 'Error al registrar usuario');
      }

      // Guardar token en localStorage
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({
          id: data.id,
          nombre: data.nombre,
          apellido: data.apellido,
          email: data.email,
          rol: data.rol
        }));
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Iniciar sesión
   */
  async login(email, password) {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.mensaje || 'Credenciales inválidas');
      }

      // Guardar token en localStorage
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({
          id: data.id,
          nombre: data.nombre,
          apellido: data.apellido,
          email: data.email,
          rol: data.rol
        }));
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Cerrar sesión
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /**
   * Obtener usuario actual desde localStorage
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Obtener token desde localStorage
   */
  getToken() {
    return localStorage.getItem('token');
  },

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated() {
    return !!this.getToken();
  }
};

export default authService;