import { Link } from "react-router-dom";
import { socialLinks } from "../data/links.js";
import Airpods from "../components/icons/Airpods.jsx";

const menu = [
  { to: "/ecouter", icon: "🎧", label: "Écouter le podcast" },
  { to: "/decla", icon: "💌", label: "Faire une décla" },
  { to: "/participer", icon: "🎙️", label: "Participer" },
];

export default function Accueil() {
  return (
    <section className="hero">
      <svg className="hero__blob" viewBox="0 0 100 100" aria-hidden="true">
        <path
          d="M51.04,84.38 C51.04,84.38 10.42,59.58 10.42,33.96 C10.42,21.67 19.79,12.92 31.25,12.92 C39.38,12.92 45.83,17.71 49.17,24.58 C51.67,17.08 58.96,11.88 67.08,11.88 C79.17,11.88 88.54,22.08 88.54,35.42 C88.54,51.25 72.71,66.67 51.04,84.38 Z"
          fill="var(--color-corail)"
        />
      </svg>

      <Airpods className="hero__airpods" />

      <h1 className="hero__wordmark">On se voix ?</h1>

      <nav className="hero__menu">
        {menu.map((item) => (
          <Link key={item.to} to={item.to} className="hero__menu-item">
            <span className="hero__menu-icon">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="hero__links">
        <a href={socialLinks.instagram} target="_blank" rel="noreferrer">
          Instagram
        </a>
        <span aria-hidden="true">·</span>
        <a href={socialLinks.tiktok} target="_blank" rel="noreferrer">
          TikTok
        </a>
        <span aria-hidden="true">·</span>
        <Link to="/a-propos">À propos de nous</Link>
      </div>
    </section>
  );
}
