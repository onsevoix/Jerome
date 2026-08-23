import { Link } from "react-router-dom";
import { socialLinks } from "../data/links.js";
import HeartToAirpods from "../components/icons/HeartToAirpods.jsx";

const menu = [
  { to: "/ecouter", icon: "🎧", label: "Écouter le podcast" },
  { to: "/decla", icon: "💌", label: "Faire une décla" },
  { to: "/participer", icon: "🎙️", label: "Participer" },
];

export default function Accueil() {
  return (
    <section className="hero">
      <svg className="hero__shape hero__shape--violet" viewBox="0 0 100 100" aria-hidden="true">
        <path
          d="M-15,105 L-15,58 C0,50 8,66 22,60 C38,53 34,32 52,30 C68,28 66,50 82,44 C95,39 92,15 108,20 L108,105 Z"
          fill="var(--color-violet)"
        />
      </svg>
      <svg className="hero__shape hero__shape--lavande" viewBox="0 0 100 100" aria-hidden="true">
        <path
          d="M50,8 C68,4 90,20 88,42 C86,62 68,80 46,78 C24,76 8,58 12,36 C15,18 32,12 50,8 Z"
          fill="var(--color-lavande)"
        />
      </svg>
      <svg className="hero__shape hero__shape--corail" viewBox="0 0 100 100" aria-hidden="true">
        <path
          d="M108,-10 L108,42 C96,48 92,32 78,38 C62,45 66,64 50,67 C34,70 33,50 17,54 C4,57 6,78 -10,72 L-10,-10 Z"
          fill="var(--color-corail)"
        />
      </svg>

      <HeartToAirpods className="hero__heart" />

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
