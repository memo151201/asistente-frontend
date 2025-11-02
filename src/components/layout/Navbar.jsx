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
        <Link to="/" className="navbar-logo">
          🎓 Asistente IA
        </Link>

        <ul className="navbar-menu">
          {isAuthenticated ? (
            <>
              <li className="navbar-item">
                <Link to="/dashboard" className="navbar-link">
                  Dashboard
                </Link>
              </li>
              <li className="navbar-item">
                <Link to="/materias" className="navbar-link">
                  Materias
                </Link>
              </li>
              
              {/* ENLACE AL PANEL DE ADMIN - Solo si es ADMINISTRADOR */}
              {user?.rol === 'ADMINISTRADOR' && (
                <li className="navbar-item">
                  <Link to="/admin" className="navbar-link admin-link">
                    👨‍💼 Panel Admin
                  </Link>
                </li>
              )}
              
              <li className="navbar-item">
                <Link to="/profile" className="navbar-link">
                  Mi Perfil
                </Link>
              </li>
              <li className="navbar-item user-info">
                <span className="user-name">
                  {user?.nombre} {user?.apellido}
                </span>
                <span className="user-rol">{user?.rol}</span>
              </li>
              <li className="navbar-item">
                <button onClick={handleLogout} className="btn-logout">
                  Cerrar Sesión
                </button>
              </li>
            </>
          ) : (
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