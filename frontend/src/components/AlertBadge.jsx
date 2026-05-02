export default function AlertBadge({ unreadCount }) {
  const safeCount = Number(unreadCount) || 0;
  return (
    <span className={`pill ${safeCount > 0 ? "pill-warning" : "pill-neutral"}`}>
      {safeCount > 0 ? `${safeCount} alertas activas` : "Sin alertas activas"}
    </span>
  );
}
