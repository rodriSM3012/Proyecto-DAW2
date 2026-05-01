import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const INITIAL_FORM = {
  name: "",
  email: "",
  password: "",
  role: "operador",
};

export default function RegisterUserPage() {
  const { registerUser } = useAuth();
  const [form, setForm] = useState(INITIAL_FORM);
  const [feedback, setFeedback] = useState("");
  const [isError, setIsError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (event) => {
    setForm((previous) => ({ ...previous, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setFeedback("");

    try {
      await registerUser(form);
      setIsError(false);
      setFeedback("Usuario registrado correctamente.");
      setForm(INITIAL_FORM);
    } catch (error) {
      const backendError = error.response?.data?.error;
      setIsError(true);
      setFeedback(backendError || "No se ha podido registrar al usuario.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="card">
      <h2>Registro de usuarios</h2>
      <p className="card-text">Solo administradores pueden crear usuarios nuevos.</p>

      <form className="form-grid" onSubmit={handleSubmit}>
        <label className="form-field">
          <span>Nombre</span>
          <input value={form.name} onChange={handleChange("name")} required />
        </label>
        <label className="form-field">
          <span>Email</span>
          <input type="email" value={form.email} onChange={handleChange("email")} required />
        </label>
        <label className="form-field">
          <span>Contraseña</span>
          <input
            type="password"
            value={form.password}
            onChange={handleChange("password")}
            minLength={8}
            required
          />
        </label>
        <label className="form-field">
          <span>Rol</span>
          <select value={form.role} onChange={handleChange("role")}>
            <option value="auditor">Auditor</option>
            <option value="operador">Operador</option>
            <option value="admin">Administrador</option>
          </select>
        </label>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Guardando..." : "Crear usuario"}
        </button>
      </form>

      {feedback && <p className={`feedback ${isError ? "error" : "success"}`}>{feedback}</p>}
    </section>
  );
}
