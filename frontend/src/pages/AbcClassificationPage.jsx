import { useEffect, useState, useMemo } from "react";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

export default function AbcClassificationPage() {
  const { hasRole } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reclassifying, setReclassifying] = useState(false);
  const [filterCategory, setFilterCategory] = useState("");

  const isAdmin = hasRole("admin");

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/products");
      setProducts(res.data.products || []);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Error al cargar los productos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleReclassify = async () => {
    if (!isAdmin) return;
    setReclassifying(true);
    try {
      await api.post("/api/products/reclassify-abc");
      await loadProducts(); // Reload products after classification
      alert("Reclasificación completada exitosamente.");
    } catch (err) {
      console.error("Error reclassifying:", err);
      alert("Error al reclasificar los productos.");
    } finally {
      setReclassifying(false);
    }
  };

  const filteredProducts = useMemo(() => {
    let sorted = [...products].sort((a, b) => {
      const catA = a.categoria_abc || "Z";
      const catB = b.categoria_abc || "Z";
      if (catA < catB) return -1;
      if (catA > catB) return 1;
      return 0;
    });

    if (filterCategory) {
      sorted = sorted.filter(p => p.categoria_abc === filterCategory);
    }
    return sorted;
  }, [products, filterCategory]);

  const getCategoryStyles = (cat) => {
    switch (cat) {
      case "A": return { color: "#0f5132", background: "rgba(0, 191, 125, 0.18)" }; // verde
      case "B": return { color: "#7a5200", background: "rgba(242, 169, 0, 0.2)" }; // amarillo/oro
      case "C": return { color: "#842029", background: "rgba(201, 35, 6, 0.15)" }; // rojo
      default: return { color: "#3e4752", background: "#f2f4f7" }; // gris
    }
  };

  return (
    <div className="abc-page">
      <div className="section-title" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", marginBottom: "20px" }}>
        <div>
          <h2 style={{ margin: "0 0 6px" }}>Clasificación ABC</h2>
          <p className="muted" style={{ margin: 0 }}>Visualización de categorías y ejecución de reclasificación.</p>
        </div>
        {isAdmin && (
          <button 
            className="btn btn-primary" 
            onClick={handleReclassify} 
            disabled={reclassifying || loading}
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            <RefreshCw size={18} className={reclassifying ? "spin" : ""} />
            {reclassifying ? "Reclasificando..." : "Ejecutar reclasificación"}
          </button>
        )}
      </div>

      <div className="card" style={{ marginBottom: "20px" }}>
        <div className="catalog-filters" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <span style={{ fontWeight: 600 }}>Filtrar por categoría:</span>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{ minWidth: "150px" }}
          >
            <option value="">Todas</option>
            <option value="A">Clase A</option>
            <option value="B">Clase B</option>
            <option value="C">Clase C</option>
          </select>
        </div>
      </div>

      {loading && !reclassifying ? (
        <p>Cargando productos...</p>
      ) : error ? (
        <p className="feedback error">{error}</p>
      ) : (
        <div className="card">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Precio Unitario</th>
                  <th>Stock Actual</th>
                  <th>Stock Valorizado</th>
                  <th>Categoría ABC</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(p => {
                  const valorizado = Number(p.precio_unitario) * Number(p.stock_actual);
                  const formatEur = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" });
                  return (
                    <tr key={p.id}>
                      <td style={{ fontWeight: 600 }}>{p.nombre}</td>
                      <td>{formatEur.format(p.precio_unitario)}</td>
                      <td>{p.stock_actual}</td>
                      <td>{formatEur.format(valorizado)}</td>
                      <td>
                        <span 
                          className="pill"
                          style={{
                            ...getCategoryStyles(p.categoria_abc),
                            minWidth: "40px",
                            justifyContent: "center"
                          }}
                        >
                          {p.categoria_abc || "N/A"}
                        </span>
                      </td>
                      <td>
                        {isAdmin ? (
                          <Link to={`/catalogo/${p.id}/editar`} className="btn btn-ghost" style={{ padding: "4px 8px", fontSize: "0.85rem" }}>
                            Ajustar manual
                          </Link>
                        ) : (
                          <span className="muted">Solo lectura</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ padding: "20px", textAlign: "center" }} className="muted">
                      No se encontraron productos para esta categoría.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <style>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
