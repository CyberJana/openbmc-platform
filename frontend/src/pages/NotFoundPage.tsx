import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="stack">
      <header className="page-header">
        <div>
          <h2>Page not found</h2>
          <p>The requested route does not exist.</p>
        </div>
      </header>
      <Link className="button" to="/dashboard">
        Go to dashboard
      </Link>
    </div>
  );
}
