import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api.js";

export default function EditUserPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", role: "" });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    api.get("/api/users").then(res => {
      const u = res.data.users.find(u => u.id === Number(id));
      if (u) setForm({ name: u.name, role: u.role });
      else { setIsError(true); setFeedback("Usuario no encontrado."); }
    }).catch(err => {
      setIsError(true); setFeedback("Error al cargar usuario.");
    }).finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.put(`/api/users/${id}`, form);
      setIsError(false);
      setFeedback("Usuario actualizado correctamente.");
      setTimeout(() => navigate("/usuarios"), 1500);
    } catch (err) {
      setIsError(true);
      setFeedback(err.response?.data?.error || "Error al actualizar usuario.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="card">Cargando...</div>;

  return (
    <section className="card" style={{ maxWidth: "500px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <h2 style={{ margin: 0 }}>Editar Usuario #{id}</h2>
        <Link to="/usuarios" className="btn btn-ghost">Volver</Link>
      </div>

      <form className="form-grid" onSubmit={handleSubmit}>
        <label className="form-field">
          <span>Nombre</span>
          <input name="name" value={form.name} onChange={handleChange} required minLength={3} maxLength={120} />
        </label>
        <label className="form-field">
          <span>Rol</span>
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="auditor">Auditor</option>
            <option value="operador">Operador</option>
            <option value="admin">Administrador</option>
          </select>
        </label>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Guardando..." : "Actualizar usuario"}
        </button>
      </form>

      {feedback && <p className={`feedback ${isError ? "error" : "success"}`}>{feedback}</p>}
    </section>
  );
}
