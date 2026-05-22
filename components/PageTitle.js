export function PageTitle({ title, description }) {
  return (
    <header className="page-title">
      <h1>{title}</h1>
      <p>{description}</p>
    </header>
  );
}
