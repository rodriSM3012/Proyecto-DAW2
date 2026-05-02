import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function CatalogPage() {
  const { hasRole } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      setError("");
      try {
        const response = await api.get("/api/products");
        setProducts(response.data?.products || []);
      } catch (requestError) {
        const backendError = requestError.response?.data?.error;
        setError(backendError || "No se ha podido cargar el catálogo.");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const text = search.trim().toLowerCase();
      const matchesSearch =
        !text ||
        product.nombre?.toLowerCase().includes(text) ||
        String(product.id).includes(text) ||
        product.codigo_qr?.toLowerCase().includes(text);

      const matchesCategory =
        categoryFilter === "all" || String(product.categoria_abc || "").toUpperCase() === categoryFilter;

      const isLow = Number(product.stock_actual) < Number(product.stock_minimo || 0);
      const matchesStock =
        stockFilter === "all" || (stockFilter === "low" ? isLow : !isLow);

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, search, categoryFilter, stockFilter]);

  if (loading) {
    return <section className="card">Cargando catálogo...</section>;
  }

  if (error) {
    return <section className="card feedback error">{error}</section>;
  }

  return (
    <section className="dashboard-grid">
      <section className="card">
        <div className="catalog-toolbar">
          <div>
            <h2>Catálogo de productos</h2>
            <p className="card-text">Listado principal con filtros rápidos y acceso al detalle.</p>
          </div>
          {hasRole("admin") && (
            <Link className="btn btn-primary" to="/catalogo/nuevo">
              Nuevo producto
            </Link>
          )}
        </div>

        <div className="catalog-filters">
          <input
            placeholder="Buscar por nombre, ID o QR..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
            <option value="all">Todas las categorías</option>
            <option value="A">Categoría A</option>
            <option value="B">Categoría B</option>
            <option value="C">Categoría C</option>
          </select>
          <select value={stockFilter} onChange={(event) => setStockFilter(event.target.value)}>
            <option value="all">Todo el stock</option>
            <option value="low">Solo stock bajo</option>
            <option value="ok">Stock correcto</option>
          </select>
        </div>
      </section>

      <section className="card">
        <h3 className="section-title">Resultados ({filteredProducts.length})</h3>
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="catalog-item">
              <ProductCard product={product} />
              <div className="catalog-actions">
                <Link className="btn btn-ghost" to={`/catalogo/${product.id}`}>
                  Ver detalle
                </Link>
                {hasRole("admin") && (
                  <Link className="btn btn-primary" to={`/catalogo/${product.id}/editar`}>
                    Editar
                  </Link>
                )}
              </div>
            </div>
          ))}
          {filteredProducts.length === 0 && <p className="muted">No hay productos con esos filtros.</p>}
        </div>
      </section>
    </section>
  );
}
