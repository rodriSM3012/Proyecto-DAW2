export default function StockBadge({ stock, minStock }) {
  const isLow = Number(stock) < Number(minStock);
  return (
    <span className={`pill ${isLow ? "pill-warning" : "pill-success"}`}>
      {isLow ? `Stock bajo (${stock})` : `Stock OK (${stock})`}
    </span>
  );
}
