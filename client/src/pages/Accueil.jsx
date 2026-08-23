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
      <svg
        className="hero__band hero__band--corail"
        viewBox="0 0 400 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0,0 L400,0 L400,22 C370,32 340,15 300,20 C260,26 235,12 190,19 C150,25 130,14 90,20 C55,25 30,18 0,23 Z"
          fill="var(--color-corail)"
        />
      </svg>
      <svg
        className="hero__band hero__band--rose"
        viewBox="0 0 400 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0,0 L400,0 L400,54 C365,66 335,45 295,53 C250,62 225,42 180,50 C140,57 115,40 75,48 C40,55 15,48 0,54 Z"
          fill="var(--color-rose)"
        />
      </svg>
      <svg
        className="hero__band hero__band--lavande"
        viewBox="0 0 400 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0,0 L400,0 L400,64 C368,74 340,58 298,64 C255,70 230,55 185,61 C145,67 118,53 78,60 C42,65 18,60 0,64 Z"
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
