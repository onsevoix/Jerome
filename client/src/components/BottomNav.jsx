import { NavLink, useLocation } from "react-router-dom";

const publicTabs = [
  { to: "/ecouter", icon: "🎧", label: "Écouter" },
  { to: "/decla", icon: "💌", label: "Décla" },
  { to: "/participer", icon: "🎙️", label: "Participer" },
];

const adminTabs = [
  { to: "/admin", icon: "🎙️", label: "Participations" },
  { to: "/admin/declas", icon: "💌", label: "Crushs vocaux" },
];

export default function BottomNav() {
  const location = useLocation();
  const tabs = location.pathname.startsWith("/admin") ? adminTabs : publicTabs;

  return (
    <nav className="bottom-nav">
      <NavLink
        to="/"
        end
        className={({ isActive }) => `bottom-nav__home ${isActive ? "active" : ""}`}
        aria-label="Accueil"
        title="Accueil"
      >
        <svg viewBox="0 0 24 24" fill="none" width="16" height="16" aria-hidden="true">
          <path
            d="M15 5L8 12L15 19"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </NavLink>

      <span className="bottom-nav__divider" aria-hidden="true" />

      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.to === "/admin"}
          className={({ isActive }) => `bottom-nav__item ${isActive ? "active" : ""}`}
        >
          <span className="bottom-nav__icon">{tab.icon}</span>
          <span className="bottom-nav__label">{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
