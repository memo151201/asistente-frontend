// components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          🎓 Asistente IA
        </Link>

        <ul className="navbar-menu">
          {isAuthenticated ? (
            <>
              {/* Si es ADMINISTRADOR - Solo Panel Admin y Mi Perfil */}
              {user?.rol === 'ADMINISTRADOR' ? (
                <>
                  <li className="navbar-item">
                    <Link to="/admin" className="navbar-link">
                      👨‍💼 Panel Admin
                    </Link>
                  </li>
                  <li className="navbar-item">
                    <Link to="/admin/perfil" className="navbar-link">
                      👤 Mi Perfil
                    </Link>
                  </li>
                </>
              ) : (
                // Si es USUARIO NORMAL - Dashboard, Materias y Mi Perfil
                <>
                  <li className="navbar-item">
                    <Link to="/dashboard" className="navbar-link">
                      📚 Dashboard
                    </Link>
                  </li>
                  <li className="navbar-item">
                    <Link to="/materias" className="navbar-link">
                      📖 Materias
                    </Link>
                  </li>
                  <li className="navbar-item">
                    <Link to="/profile" className="navbar-link">
                      👤 Mi Perfil
                    </Link>
                  </li>
                </>
              )}

              {/* Info del Usuario */}
              <li className="navbar-item user-info">
                <div className="user-details">
                  <span className="user-badge">{user?.rol}</span>
                  <span className="user-name">
                    {user?.nombre} {user?.apellido}
                  </span>
                </div>
              </li>

              {/* Botón Cerrar Sesión */}
              <li className="navbar-item">
                <button onClick={handleLogout} className="btn-logout">
                  Cerrar Sesión
                </button>
              </li>
            </>
          ) : (
            // Usuario NO autenticado
            <>
              <li className="navbar-item">
                <Link to="/login" className="navbar-link">
                  Iniciar Sesión
                </Link>
              </li>
              <li className="navbar-item">
                <Link to="/register" className="btn-register">
                  Registrarse
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;