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
          d="M-15,115 L-15,65 C0,55 10,72 26,64 C44,55 38,28 58,24 C78,20 78,46 98,40 C112,36 106,12 125,18 L125,115 Z"
          fill="var(--color-violet)"
        />
      </svg>
      <svg className="hero__shape hero__shape--lavande" viewBox="0 0 100 100" aria-hidden="true">
        <path
          d="M52,8 C74,3 96,20 93,44 C90,66 68,84 44,81 C20,78 2,58 7,35 C11,16 30,13 52,8 Z"
          fill="var(--color-lavande)"
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
