import StockBadge from "./StockBadge.jsx";

function formatCurrency(value) {
  const amount = Number(value) || 0;
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

export default function ProductCard({ product }) {
  return (
    <article className="mini-card">
      <h4>{product.nombre}</h4>
      <p className="muted">{product.descripcion || "Sin descripción"}</p>
      <div className="mini-card-row">
        <StockBadge stock={product.stock_actual} minStock={product.stock_minimo} />
        <span className="pill pill-neutral">ABC: {product.categoria_abc || "-"}</span>
      </div>
      <p className="mini-card-price">{formatCurrency(product.precio_unitario)}</p>
    </article>
  );
}
