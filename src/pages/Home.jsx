// src/pages/Home.jsx

import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Pages.css';

const Home = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="hero-title">
          🎓 Asistente de Aprendizaje con IA
        </h1>
        <p className="hero-subtitle">
          Aprende programación de manera interactiva con retroalimentación personalizada
        </p>

        <div className="hero-features">
          <div className="feature-card">
            <span className="feature-icon">📚</span>
            <h3>Múltiples Materias</h3>
            <p>Fundamentos, POO, Estructuras de Datos y más</p>
          </div>

          <div className="feature-card">
            <span className="feature-icon">🤖</span>
            <h3>IA Personalizada</h3>
            <p>Retroalimentación inteligente adaptada a tu nivel</p>
          </div>

          <div className="feature-card">
            <span className="feature-icon">📊</span>
            <h3>Seguimiento</h3>
            <p>Monitorea tu progreso y estadísticas</p>
          </div>
        </div>

        <div className="hero-cta">
          {isAuthenticated ? (
            user?.rol === 'ADMINISTRADOR' ? (
              <Link to="/admin" className="cta-button">
                Ir al Panel de Administración
              </Link>
            ) : (
              <Link to="/dashboard" className="cta-button">
                Ir al Dashboard
              </Link>
            )
          ) : (
            <>
              <Link to="/register" className="cta-button">
                Comenzar Ahora
              </Link>
              <Link to="/login" className="cta-button-secondary">
                Iniciar Sesión
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Sección para ESTUDIANTES o visitantes */}
      {user?.rol !== 'ADMINISTRADOR' && (
        <div className="info-section">
          <h2>¿Cómo funciona?</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Regístrate</h3>
              <p>Crea tu cuenta de estudiante</p>
            </div>

            <div className="step">
              <div className="step-number">2</div>
              <h3>Elige una Materia</h3>
              <p>Selecciona el tema que quieres aprender</p>
            </div>

            <div className="step">
              <div className="step-number">3</div>
              <h3>Practica</h3>
              <p>Resuelve ejercicios y recibe retroalimentación de IA</p>
            </div>

            <div className="step">
              <div className="step-number">4</div>
              <h3>Mejora</h3>
              <p>Analiza tus resultados y sigue aprendiendo</p>
            </div>
          </div>
        </div>
      )}

      {/* Mensaje de bienvenida para ADMINISTRADORES */}
      {user?.rol === 'ADMINISTRADOR' && (
        <div className="info-section">
          <div className="admin-welcome">
            <h2>👋 Bienvenido, Administrador</h2>
            <p>Accede al panel de administración para gestionar el sistema educativo</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;