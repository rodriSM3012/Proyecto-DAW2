export default function KpiCard({ label, value, tone = "neutral" }) {
  return (
    <article className={`kpi-card kpi-${tone}`}>
      <p className="kpi-label">{label}</p>
      <p className="kpi-value">{value}</p>
    </article>
  );
}
