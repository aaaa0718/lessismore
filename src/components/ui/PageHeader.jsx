export default function PageHeader({ title, description, action }) {
  return <header className="ui-page-header">
    <div className="ui-page-heading">
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </div>
    {action}
  </header>;
}
