// src/pages/admin/AdminDashboard.jsx

import { Link } from 'react-router-dom';
import './Admin.css';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <h1>Panel de Administración</h1>
      
      <div className="admin-cards">
        <Link to="/admin/materias" className="admin-card">
          <h3>📚 Materias</h3>
          <p>Crear, editar y eliminar materias</p>
        </Link>

        <Link to="/admin/temas" className="admin-card">
          <h3>📖 Temas</h3>
          <p>Gestionar temas de las materias</p>
        </Link>

        <Link to="/admin/subtemas" className="admin-card">
          <h3>📝 Subtemas</h3>
          <p>Administrar subtemas</p>
        </Link>

        <Link to="/admin/preguntas" className="admin-card">
          <h3>❓ Preguntas</h3>
          <p>Crear y editar preguntas</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;