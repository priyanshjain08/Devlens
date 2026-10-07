import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="navbar">
      <NavLink to="/" className="navbar-brand">
        <span className="navbar-mark" aria-hidden="true">
          <svg viewBox="0 0 32 32" width="24" height="24">
            <circle cx="14" cy="14" r="9.5" fill="none" stroke="currentColor" strokeWidth="2.5" />
            <line x1="21" y1="21" x2="28" y2="28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </span>
        <span className="navbar-wordmark">
          Dev<span className="navbar-wordmark-accent">Lens</span>
        </span>
      </NavLink>

      <nav className="navbar-links">
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'is-active' : '')}>
          Workspace
        </NavLink>
        <NavLink to="/history" className={({ isActive }) => (isActive ? 'is-active' : '')}>
          History
        </NavLink>
      </nav>
    </header>
  );
}
