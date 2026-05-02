import { useState, useEffect, useMemo } from "react";
import api from "../services/api.js";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function MovementsPage() {
  const [movements, setMovements] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [filterType, setFilterType] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterProduct, setFilterProduct] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // Fetch movements and products concurrently to display product names
        const [movRes, prodRes] = await Promise.all([
          api.get("/api/movimientos"),
          api.get("/api/products")
        ]);

        const movData = movRes.data.movements || [];
        const prodData = prodRes.data.products || [];

        const prodMap = {};
        prodData.forEach(p => {
          prodMap[p.id] = p.nombre;
        });

        setMovements(movData);
        setProducts(prodMap);
      } catch (err) {
        console.error("Error fetching movements:", err);
        setError("Error al cargar los movimientos.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredMovements = useMemo(() => {
    return movements.filter(m => {
      // Type filter
      if (filterType && m.tipo !== filterType) return false;
      // Date filter
      if (filterDate && !m.fecha.startsWith(filterDate)) return false;
      // Product name filter
      if (filterProduct) {
        const pName = products[m.producto_id]?.toLowerCase() || "";
        if (!pName.includes(filterProduct.toLowerCase())) return false;
      }
      return true;
    });
  }, [movements, filterType, filterDate, filterProduct, products]);

  const totalPages = Math.ceil(filteredMovements.length / ITEMS_PER_PAGE) || 1;
  const currentMovements = filteredMovements.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="movements-page">
      <div className="section-title">
        <h2>Historial de Movimientos</h2>
        <p className="muted">Consulta y filtra los movimientos de inventario.</p>
      </div>

      <div className="card" style={{ marginBottom: "20px" }}>
        <div className="catalog-filters">
          <input
            type="text"
            placeholder="Buscar producto..."
            value={filterProduct}
            onChange={(e) => {
              setFilterProduct(e.target.value);
              setCurrentPage(1);
            }}
          />
          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">Todos los tipos</option>
            <option value="entrada">Entrada</option>
            <option value="salida">Salida</option>
            <option value="ajuste">Ajuste</option>
          </select>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => {
              setFilterDate(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {loading ? (
        <p>Cargando movimientos...</p>
      ) : error ? (
        <p className="feedback error">{error}</p>
      ) : (
        <div className="card">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fecha</th>
                  <th>Producto</th>
                  <th>Tipo</th>
                  <th>Cantidad</th>
                  <th>Usuario ID</th>
                  <th>Detalle</th>
                </tr>
              </thead>
              <tbody>
                {currentMovements.map(m => (
                  <tr key={m.id}>
                    <td>{m.id}</td>
                    <td>
                      {new Date(m.fecha).toLocaleString()}
                    </td>
                    <td style={{ fontWeight: "600" }}>
                      {products[m.producto_id] || `Desconocido (${m.producto_id})`}
                    </td>
                    <td>
                      <span className={`pill ${m.tipo === 'entrada' ? 'pill-success' : m.tipo === 'salida' ? 'pill-warning' : 'pill-neutral'}`}>
                        {m.tipo.charAt(0).toUpperCase() + m.tipo.slice(1)}
                      </span>
                    </td>
                    <td style={{ fontWeight: "bold", color: m.cantidad > 0 ? 'var(--color-logistics-green)' : (m.cantidad < 0 ? 'var(--color-scorched-red)' : 'inherit') }}>
                      {m.cantidad > 0 ? `+${m.cantidad}` : m.cantidad}
                    </td>
                    <td>{m.usuario_id}</td>
                    <td className="muted">{m.detalle || "-"}</td>
                  </tr>
                ))}
                {currentMovements.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ padding: "20px", textAlign: "center" }} className="muted">
                      No se encontraron movimientos.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="pagination-controls">
            <span className="muted">
              Mostrando {currentMovements.length} de {filteredMovements.length} registros
            </span>
            <div className="pagination-actions">
              <button
                className="btn btn-ghost"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                style={{ padding: "4px 8px", minHeight: "auto" }}
                title="Página anterior"
              >
                <ChevronLeft size={20} />
              </button>
              <span style={{ fontWeight: "600", fontSize: "0.9rem" }}>
                Página {currentPage} de {totalPages}
              </span>
              <button
                className="btn btn-ghost"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                style={{ padding: "4px 8px", minHeight: "auto" }}
                title="Página siguiente"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
