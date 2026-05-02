import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import AlertBadge from "../components/AlertBadge.jsx";
import KpiCard from "../components/KpiCard.jsx";
import ProductCard from "../components/ProductCard.jsx";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

function getAbcData(products) {
  const summary = { A: 0, B: 0, C: 0, SinCategoria: 0 };
  products.forEach((product) => {
    const key = product.categoria_abc || "SinCategoria";
    summary[key] = (summary[key] || 0) + 1;
  });

  return [
    { categoria: "A", productos: summary.A || 0 },
    { categoria: "B", productos: summary.B || 0 },
    { categoria: "C", productos: summary.C || 0 },
    { categoria: "Sin", productos: summary.SinCategoria || 0 },
  ];
}

function formatDate(value) {
  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function DashboardPage() {
  const { hasRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [movements, setMovements] = useState([]);

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      setError("");
      try {
        const response = await api.get("/api/dashboard");
        const data = response.data;
        setProducts(data.products || []);
        setAlerts(data.alerts || []);
        setMovements(data.movements || []);
      } catch (requestError) {
        const backendError = requestError.response?.data?.error;
        setError(backendError || "No se han podido cargar los datos del dashboard.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const totalStock = useMemo(
    () => products.reduce((acc, product) => acc + Number(product.stock_actual || 0), 0),
    [products],
  );
  const lowStockProducts = useMemo(
    () =>
      products.filter((product) => Number(product.stock_actual) < Number(product.stock_minimo || 0)),
    [products],
  );
  const unreadAlerts = useMemo(() => alerts.filter((alert) => !alert.leida), [alerts]);
  const abcData = useMemo(() => getAbcData(products), [products]);
  const latestMovements = useMemo(() => movements.slice(0, 8), [movements]);

  const canSeeAdminBlocks = hasRole("admin");
  const canSeeAuditorBlocks = hasRole("auditor");
  const canSeeOperatorBlocks = hasRole("operador");

  if (loading) {
    return <section className="card">Cargando dashboard...</section>;
  }

  if (error) {
    return <section className="card feedback error">{error}</section>;
  }

  return (
    <section className="dashboard-grid">
      <div className="kpi-grid">
        <KpiCard label="Productos activos" value={products.length} tone="neutral" />
        <KpiCard label="Stock global" value={totalStock} tone="success" />
        <KpiCard label="Stock bajo" value={lowStockProducts.length} tone="warning" />
        <KpiCard label="Movimientos (últimos)" value={latestMovements.length} tone="neutral" />
      </div>

      {canSeeAdminBlocks && (
        <section className="card">
          <h2>Resumen admin</h2>
          <p className="card-text">
            Vista de control global con alertas, rotación ABC y movimientos recientes.
          </p>
          <div className="section-row">
            <AlertBadge unreadCount={unreadAlerts.length} />
          </div>
        </section>
      )}

      {canSeeOperatorBlocks && (
        <section className="card">
          <h2>Bloque operador</h2>
          <p className="card-text">
            Acceso rápido al flujo de escaneo QR, tareas pendientes y avisos operativos.
          </p>
        </section>
      )}

      {canSeeAuditorBlocks && (
        <section className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ margin: 0 }}>Resumen de movimientos</h2>
            <Link to="/movimientos" className="btn btn-ghost" style={{ fontSize: "0.85rem", padding: "4px 8px", minHeight: "auto" }}>Ver todos</Link>
          </div>
          <div className="list">
            {latestMovements.length === 0 ? (
              <p className="muted">No hay movimientos todavía.</p>
            ) : (
              latestMovements.map((movement) => (
                <div key={movement.id} className="list-item">
                  <div>
                    <strong>{movement.tipo.charAt(0).toUpperCase() + movement.tipo.slice(1)}</strong> · {movement.producto_nombre || `Producto #${movement.producto_id}`}
                  </div>
                  <small className="muted">
                    {movement.cantidad} uds · {formatDate(movement.fecha)}
                  </small>
                </div>
              ))
            )}
          </div>
        </section>
      )}

      <section className="card">
        <h2>Distribución ABC</h2>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={abcData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="categoria" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="productos" fill="#1D6A92" name="Productos" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="card">
        <h2>Productos destacados</h2>
        <p className="card-text">Muestra inicial reutilizable para catálogo y detalle.</p>
        <div className="product-grid">
          {products.slice(0, 6).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {products.length === 0 && <p className="muted">No hay productos para mostrar.</p>}
        </div>
      </section>
    </section>
  );
}
