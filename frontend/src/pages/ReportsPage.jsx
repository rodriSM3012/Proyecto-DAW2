import { useState } from "react";
import api from "../services/api.js";
import { Download } from "lucide-react";

export default function ReportsPage() {
  const [downloading, setDownloading] = useState(false);

  const downloadCSV = (filename, csvContent) => {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportMovements = async () => {
    setDownloading(true);
    try {
      const res = await api.get("/api/movimientos");
      const movements = res.data.movements || [];
      const header = "ID,Producto_ID,Tipo,Cantidad,Fecha,Usuario_ID,Detalle\n";
      const csv = movements.map(m => 
        `${m.id},${m.producto_id},${m.tipo},${m.cantidad},${new Date(m.fecha).toISOString()},${m.usuario_id},"${m.detalle || ''}"`
      ).join("\n");
      downloadCSV("movimientos.csv", header + csv);
    } catch (err) {
      console.error(err);
      alert("Error exportando movimientos.");
    } finally {
      setDownloading(false);
    }
  };

  const exportErrors = async () => {
    setDownloading(true);
    try {
      const res = await api.get("/api/alertas");
      const alerts = res.data.alerts || [];
      const header = "ID,Producto,Fecha,Leida\n";
      const csv = alerts.map(a => 
        `${a.id},"${a.producto_nombre}",${new Date(a.fecha).toISOString()},${a.leida ? 'Si' : 'No'}`
      ).join("\n");
      downloadCSV("alertas_errores.csv", header + csv);
    } catch (err) {
      console.error(err);
      alert("Error exportando errores/alertas.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="reports-page">
      <div className="section-title">
        <h2>Reportes y estadísticas</h2>
        <p className="muted">Exportación de datos del sistema para auditoría y control externo.</p>
      </div>

      <div className="dashboard-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
        <section className="card">
          <h2>Reporte de Movimientos</h2>
          <p className="card-text">Exporta el historial completo de entradas, salidas y ajustes realizados en el inventario.</p>
          <button className="btn btn-primary" onClick={exportMovements} disabled={downloading} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <Download size={18} /> Descargar CSV
          </button>
        </section>
        
        <section className="card">
          <h2>Reporte de Errores y Alertas</h2>
          <p className="card-text">Exporta el registro de discrepancias, stock bajo y alertas detectadas por el sistema.</p>
          <button className="btn btn-primary" onClick={exportErrors} disabled={downloading} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <Download size={18} /> Descargar CSV
          </button>
        </section>

        <section className="card" style={{ gridColumn: "1 / -1" }}>
          <h2>Gráficos Anuales (Demo)</h2>
          <p className="card-text">Visualización de tendencias de inventario en el año actual.</p>
          <div style={{ height: "300px", display: "flex", justifyContent: "center", alignItems: "center", background: "var(--color-surface)", borderRadius: "8px", border: "1px dashed var(--color-border)" }}>
            <p className="muted" style={{ fontWeight: 600 }}>Gráfico de rotación (Simulación)</p>
          </div>
        </section>
      </div>
    </div>
  );
}
