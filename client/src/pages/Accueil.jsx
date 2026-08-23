import { Link } from "react-router-dom";
import { socialLinks } from "../data/links.js";
import Heart from "../components/icons/Heart.jsx";

const menu = [
  { to: "/ecouter", icon: "🎧", label: "Écouter le podcast" },
  { to: "/decla", icon: "💌", label: "Faire une décla" },
  { to: "/participer", icon: "🎙️", label: "Participer" },
];

export default function Accueil() {
  return (
    <section className="hero">
      <span className="hero__shape" aria-hidden="true" />

      <Heart className="hero__heart" />

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
