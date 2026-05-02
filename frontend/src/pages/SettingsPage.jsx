export default function SettingsPage() {
  const handleSave = (e) => {
    e.preventDefault();
    alert("Configuración guardada (Demo).");
  };

  return (
    <div className="settings-page">
      <div className="section-title">
        <h2>Configuración General</h2>
        <p className="muted">Parámetros del sistema y preferencias de la aplicación (Modo Demo).</p>
      </div>

      <div className="card" style={{ maxWidth: "600px" }}>
        <form className="form-grid" onSubmit={handleSave}>
          <h3 style={{ margin: "10px 0 16px" }}>Notificaciones del Sistema</h3>
          
          <label style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "12px" }}>
            <input type="checkbox" defaultChecked />
            <span>Recibir correos de alertas de stock bajo</span>
          </label>
          
          <label style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "20px" }}>
            <input type="checkbox" defaultChecked />
            <span>Recibir alertas semanales de inventario ABC</span>
          </label>

          <h3 style={{ margin: "20px 0 16px", borderTop: "1px solid var(--color-border)", paddingTop: "20px" }}>Preferencias de la Interfaz</h3>
          
          <label className="form-field">
            <span>Zona Horaria</span>
            <select defaultValue="Europe/Madrid">
              <option value="Europe/Madrid">Europa/Madrid</option>
              <option value="America/Mexico_City">América/Ciudad de México</option>
              <option value="America/Buenos_Aires">América/Buenos Aires</option>
            </select>
          </label>

          <label className="form-field">
            <span>Idioma</span>
            <select defaultValue="es">
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
          </label>

          <div style={{ marginTop: "20px" }}>
            <button type="submit" className="btn btn-primary">
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
