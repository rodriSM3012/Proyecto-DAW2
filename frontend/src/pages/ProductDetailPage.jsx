import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

function formatDate(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isErrorFeedback, setIsErrorFeedback] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      setError("");
      try {
        const response = await api.get(`/api/products/${id}`);
        setProduct(response.data?.product || null);
      } catch (requestError) {
        const backendError = requestError.response?.data?.error;
        setError(backendError || "No se ha podido cargar el producto.");
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  const handleDelete = async () => {
    const confirmed = window.confirm("¿Seguro que quieres eliminar este producto?");
    if (!confirmed) return;

    try {
      const response = await api.delete(`/api/products/${id}`);
      setIsErrorFeedback(false);
      setFeedback(response.data?.message || "Producto eliminado correctamente.");
      setTimeout(() => navigate("/catalogo"), 900);
    } catch (requestError) {
      setIsErrorFeedback(true);
      const backendError = requestError.response?.data?.error;
      setFeedback(backendError || "No se ha podido eliminar el producto.");
    }
  };

  if (loading) {
    return <section className="card">Cargando detalle de producto...</section>;
  }

  if (error) {
    return <section className="card feedback error">{error}</section>;
  }

  if (!product) {
    return <section className="card">Producto no encontrado.</section>;
  }

  return (
    <section className="dashboard-grid">
      <section className="card">
        <div className="catalog-toolbar">
          <div>
            <h2>Detalle de producto #{product.id}</h2>
            <p className="card-text">Vista de detalle con QR UUID y datos clave.</p>
          </div>
          <div className="catalog-actions">
            <Link className="btn btn-ghost" to="/catalogo">
              Volver
            </Link>
            {hasRole("admin") && (
              <>
                <Link className="btn btn-primary" to={`/catalogo/${product.id}/editar`}>
                  Editar
                </Link>
                <button type="button" className="btn btn-danger" onClick={handleDelete}>
                  Eliminar
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {feedback && (
        <p className={`feedback ${isErrorFeedback ? "error" : "success"}`}>
          {feedback}
        </p>
      )}

      <section className="card">
        <ProductCard product={product} />
      </section>

      <section className="card details-grid">
        <div>
          <h3 className="section-title">Código QR (UUID)</h3>
          <code className="mono-box">{product.codigo_qr}</code>
        </div>
        <div>
          <h3 className="section-title">Descripción</h3>
          <p className="card-text">{product.descripcion || "Sin descripción."}</p>
        </div>
        <div>
          <h3 className="section-title">Fechas</h3>
          <p className="card-text">Creado: {formatDate(product.creado_en)}</p>
          <p className="card-text">Actualizado: {formatDate(product.actualizado_en)}</p>
        </div>
      </section>
    </section>
  );
}
