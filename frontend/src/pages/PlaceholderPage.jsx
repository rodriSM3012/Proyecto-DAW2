export default function PlaceholderPage({ title, description, bullets = [] }) {
  return (
    <section className="card">
      <h2>{title}</h2>
      <p className="card-text">{description}</p>
      {bullets.length > 0 && (
        <ul className="card-list">
          {bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
