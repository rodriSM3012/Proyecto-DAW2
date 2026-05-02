import { useEffect, useState } from "react";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { CheckCircle, AlertTriangle, Settings } from "lucide-react";
import { Link } from "react-router-dom";

export default function AlertsPage() {
  const { hasRole } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAlerts = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await api.get("/api/alertas");
      setAlerts(res.data.alerts || []);
    } catch (err) {
      console.error("Error fetching alerts:", err);
      if (!silent) setError("Error al cargar las alertas.");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
    const interval = setInterval(() => loadAlerts(true), 30000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.patch(`/api/alertas/${id}/read`);
      setAlerts(alerts.map(a => a.id === id ? { ...a, leida: 1 } : a));
    } catch (err) {
      console.error("Error marking alert as read:", err);
      alert("Error al marcar la alerta como leída.");
    }
  };

  const isAdmin = hasRole("admin");

  return (
    <div className="alerts-page">
      <div className="section-title" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", marginBottom: "20px" }}>
        <div>
          <h2 style={{ margin: "0 0 6px" }}>Módulo de Alertas</h2>
          <p className="muted" style={{ margin: 0 }}>Visualización y gestión de alertas de stock bajo.</p>
        </div>
        {isAdmin && (
          <Link to="/catalogo" className="btn btn-ghost" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Settings size={18} />
            Configurar Umbrales (Catálogo)
          </Link>
        )}
      </div>

      {loading ? (
        <p>Cargando alertas...</p>
      ) : error ? (
        <p className="feedback error">{error}</p>
      ) : (
        <div className="card">
          {alerts.length === 0 ? (
            <p className="muted" style={{ textAlign: "center", padding: "20px" }}>
              No hay alertas registradas.
            </p>
          ) : (
            <div className="list">
              {alerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className="list-item" 
                  style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center",
                    borderLeft: !alert.leida ? "4px solid var(--color-scorched-red)" : "4px solid transparent",
                    background: !alert.leida ? "rgba(201, 35, 6, 0.03)" : "#fff",
                    flexWrap: "wrap",
                    gap: "10px"
                  }}
                >
                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <AlertTriangle 
                      size={24} 
                      color={!alert.leida ? "var(--color-scorched-red)" : "var(--color-concrete)"} 
                    />
                    <div>
                      <h4 style={{ margin: "0 0 4px 0", color: !alert.leida ? "var(--color-midnight)" : "var(--color-concrete)" }}>
                        Stock bajo: {alert.producto_nombre || `Producto #${alert.producto_id}`}
                      </h4>
                      <small className="muted">
                        Detectado el {new Date(alert.fecha).toLocaleString()}
                        {alert.email_enviado ? " · Correo enviado" : ""}
                      </small>
                    </div>
                  </div>
                  
                  {isAdmin && !alert.leida && (
                    <button 
                      className="btn btn-ghost" 
                      onClick={() => markAsRead(alert.id)}
                      style={{ color: "var(--color-logistics-green)", padding: "6px 10px", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "6px" }}
                      title="Marcar como leída"
                    >
                      <CheckCircle size={16} />
                      Marcar leída
                    </button>
                  )}
                  {alert.leida && (
                    <span className="pill pill-neutral" style={{ fontSize: "0.8rem", height: "fit-content" }}>
                      Leída
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
