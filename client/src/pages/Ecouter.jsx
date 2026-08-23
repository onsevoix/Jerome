import { platformLinks } from "../data/links.js";
import { SpotifyIcon, ApplePodcastsIcon, DeezerIcon } from "../components/icons/PlatformIcons.jsx";
import Heart from "../components/icons/Heart.jsx";

const icons = {
  spotify: SpotifyIcon,
  apple: ApplePodcastsIcon,
  deezer: DeezerIcon,
};

export default function Ecouter() {
  return (
    <section>
      <h2 className="page__title page__title--centered">Écouter</h2>
      <p className="page__lead page__lead--centered">
        <strong className="page__lead-strong">On se voix ?</strong> est disponible gratuitement
        sur toutes les plateformes d'écoute. Choisissez la vôtre :
      </p>
      <div className="platform-grid">
        {platformLinks.map((platform) => {
          const Icon = icons[platform.id];
          return (
            <a
              key={platform.name}
              href={platform.url}
              target="_blank"
              rel="noreferrer"
              className="platform-card"
            >
              <span className="platform-card__icon">
                <Icon className="platform-card__icon-svg" />
              </span>
              {platform.name}
            </a>
          );
        })}
      </div>

      <div className="rating-callout">
        <Heart className="rating-callout__heart" />
        <h3 className="rating-callout__title">Vous aimez le podcast ?</h3>
        <p className="rating-callout__text">
          Laissez-nous 5 étoiles sur votre plateforme préférée, ça nous aide à faire grandir la
          communauté&nbsp;!
        </p>
      </div>
    </section>
  );
}
