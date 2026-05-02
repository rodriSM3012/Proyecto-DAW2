import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api.js";

export default function ProfilePage() {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback("");
    if (newPassword !== confirmPassword) {
      setIsError(true);
      setFeedback("Las contraseñas nuevas no coinciden.");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/api/users/change-password", {
        currentPassword,
        newPassword
      });
      setIsError(false);
      setFeedback("Contraseña actualizada exitosamente.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      setIsError(true);
      setFeedback(err.response?.data?.error || "Error al cambiar la contraseña.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="profile-page dashboard-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
      <section className="card">
        <h2>Datos del Perfil</h2>
        <div className="details-grid" style={{ marginTop: "20px" }}>
          <div>
            <span className="muted" style={{ display: "block", fontSize: "0.85rem" }}>Nombre Completo</span>
            <span style={{ fontWeight: 600, fontSize: "1.1rem" }}>{user?.name || "-"}</span>
          </div>
          <div>
            <span className="muted" style={{ display: "block", fontSize: "0.85rem" }}>Correo Electrónico</span>
            <span style={{ fontWeight: 600, fontSize: "1.1rem" }}>{user?.email || "-"}</span>
          </div>
          <div>
            <span className="muted" style={{ display: "block", fontSize: "0.85rem" }}>Rol Asignado</span>
            <span className="pill pill-neutral" style={{ marginTop: "4px" }}>
              {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "-"}
            </span>
          </div>
        </div>
      </section>

      <section className="card">
        <h2>Cambiar Contraseña</h2>
        <form className="form-grid" onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
          <label className="form-field">
            <span>Contraseña Actual</span>
            <input 
              type="password" 
              value={currentPassword} 
              onChange={e => setCurrentPassword(e.target.value)} 
              required 
            />
          </label>
          <label className="form-field">
            <span>Nueva Contraseña</span>
            <input 
              type="password" 
              value={newPassword} 
              onChange={e => setNewPassword(e.target.value)} 
              minLength={8}
              required 
            />
          </label>
          <label className="form-field">
            <span>Confirmar Nueva Contraseña</span>
            <input 
              type="password" 
              value={confirmPassword} 
              onChange={e => setConfirmPassword(e.target.value)} 
              minLength={8}
              required 
            />
          </label>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Actualizando..." : "Actualizar Contraseña"}
          </button>
        </form>
        {feedback && <p className={`feedback ${isError ? "error" : "success"}`}>{feedback}</p>}
      </section>
    </div>
  );
}
