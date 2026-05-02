import { useEffect, useState } from "react";
import api from "../services/api.js";
import { Link } from "react-router-dom";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/users");
      setUsers(res.data.users || []);
    } catch (err) {
      console.error(err);
      setError("Error al cargar usuarios.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (userId) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar a este usuario?")) return;
    try {
      await api.delete(`/api/users/${userId}`);
      loadUsers();
    } catch (err) {
      console.error(err);
      alert("Error al eliminar el usuario.");
    }
  };

  return (
    <div className="users-page">
      <div className="section-title" style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "10px", marginBottom: "20px" }}>
        <div>
          <h2 style={{ margin: "0 0 6px" }}>Administración de Usuarios</h2>
          <p className="muted" style={{ margin: 0 }}>Gestiona los accesos, roles y estado de las cuentas.</p>
        </div>
        <Link to="/usuarios/nuevo" className="btn btn-primary">
          + Nuevo usuario
        </Link>
      </div>

      {loading ? (
        <p>Cargando usuarios...</p>
      ) : error ? (
        <p className="feedback error">{error}</p>
      ) : (
        <div className="card">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Creado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td style={{ fontWeight: 600 }}>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className="pill pill-neutral">{u.role}</span>
                    </td>
                    <td className="muted">{new Date(u.created_at).toLocaleDateString()}</td>
                    <td style={{ display: "flex", gap: "8px" }}>
                      <Link
                        to={`/usuarios/${u.id}/editar`}
                        className="btn btn-ghost"
                        style={{ padding: "4px 8px", fontSize: "0.85rem" }}
                      >
                        Editar
                      </Link>
                      <button 
                        className="btn btn-ghost" 
                        onClick={() => handleDelete(u.id)}
                        style={{ padding: "4px 8px", fontSize: "0.85rem", color: "var(--color-scorched-red)" }}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
