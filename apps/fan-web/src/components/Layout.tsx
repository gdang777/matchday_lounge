import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

type NavItem = { to: string; icon: string; label: string; pro?: boolean };

const NAV_ITEMS: NavItem[] = [
  { to: '/', icon: '⚽', label: 'Match Day Hub' },
  { to: '/happy-hour', icon: '🍺', label: 'Happy Hour' },
  { to: '/map', icon: '🗺', label: 'City Nav' },
  { to: '/emergency', icon: '🛡', label: 'Emergency' },
  { to: '/language', icon: '🌐', label: 'Language' },
  { to: '/concierge', icon: '⚡', label: 'AI Concierge', pro: true },
];

type Props = { children: React.ReactNode };

export default function Layout({ children }: Props) {
  const { user, isPro, signOut } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleSignOut() {
    await signOut();
    navigate('/login');
  }

  const SidebarContent = (
    <>
      <div className="sidebar-logo">
        <span>⚽</span>
        <span>MatchDay Lounge</span>
      </div>
      <nav className="sidebar-nav">
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
            {item.pro && <span className="nav-pro-badge">PRO</span>}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        {user ? (
          <>
            <div className="user-email">{user.email}</div>
            {isPro && <span className="badge badge-green" style={{ marginBottom: 8 }}>Pro</span>}
            <button className="btn btn-ghost btn-sm" onClick={handleSignOut}>Sign Out</button>
          </>
        ) : (
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/login')} style={{ width: '100%', border: '1px solid var(--border)' }}>Sign In / Sign Up</button>
        )}
      </div>
    </>
  );

  return (
    <div className="app-layout">
      {/* Desktop sidebar */}
      <aside className="sidebar">{SidebarContent}</aside>

      {/* Mobile sidebar overlay */}
      {menuOpen && (
        <aside className={`sidebar mobile-open`} onClick={() => setMenuOpen(false)}>
          {SidebarContent}
        </aside>
      )}

      {/* Mobile top bar */}
      <header className="mobile-nav">
        <span className="mobile-nav-title">⚽ MatchDay Lounge</span>
        <button className="mobile-menu-btn" onClick={() => setMenuOpen(v => !v)}>☰</button>
      </header>

      <main className="app-main">
        {children}
      </main>
    </div>
  );
}
