import { Link } from "react-router-dom";
import { socialLinks } from "../data/links.js";

export default function Footer() {
  return (
    <footer className="site-footer">
      <a href={socialLinks.instagram} target="_blank" rel="noreferrer">
        Instagram
      </a>
      <span aria-hidden="true">·</span>
      <a href={socialLinks.tiktok} target="_blank" rel="noreferrer">
        TikTok
      </a>
      <span aria-hidden="true">·</span>
      <Link to="/a-propos">À propos de nous</Link>
    </footer>
  );
}
